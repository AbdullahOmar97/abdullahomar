/**
 * Gemini Live API Web Audio & WebSocket Client
 * Real-time bidirectional voice and text streaming with Gemini 2.0 Live.
 */

export interface LiveClientConfig {
  voice?: string;
  onConnect?: () => void;
  onDisconnect?: (reason?: string) => void;
  onError?: (error: Error | string) => void;
  onUserSpeaking?: (isSpeaking: boolean) => void;
  onAISpeaking?: (isSpeaking: boolean, textChunk?: string) => void;
  onTranscription?: (text: string, isFinal: boolean, speaker: "user" | "model") => void;
  onInterrupted?: () => void;
}

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private inputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private inputSourceNode: MediaStreamAudioSourceNode | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  
  public inputAnalyser: AnalyserNode | null = null;
  public outputAnalyser: AnalyserNode | null = null;

  private isConnected = false;
  private isSessionReady = false;
  private isMuted = false;
  private nextPlayTime = 0;
  private activeAudioSources: AudioBufferSourceNode[] = [];
  private currentModelTranscript = "";

  private config: LiveClientConfig;

  constructor(config: LiveClientConfig = {}) {
    this.config = config;
  }

  /**
   * Connect to Gemini Live API using an ephemeral token
   */
  public async connect(token: string): Promise<void> {
    if (this.isConnected) return;

    try {
      // 1. Initialize Web Audio Contexts
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 24000 });
      this.outputAnalyser = this.audioContext.createAnalyser();
      this.outputAnalyser.fftSize = 64;
      this.outputAnalyser.smoothingTimeConstant = 0.8;
      this.outputAnalyser.connect(this.audioContext.destination);

      // 2. Request user microphone
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.inputAudioContext = new AudioCtx({ sampleRate: 16000 });
      this.inputAnalyser = this.inputAudioContext.createAnalyser();
      this.inputAnalyser.fftSize = 64;
      this.inputAnalyser.smoothingTimeConstant = 0.8;

      this.inputSourceNode = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
      this.inputSourceNode.connect(this.inputAnalyser);

      // 3. Connect WebSocket to Gemini Live API
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(
        token
      )}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        // Setup frame is required as the first message — even with constrained tokens.
        // It must match the liveConnectConstraints locked in the ephemeral token.
        try {
          const setupMessage = {
            setup: {
              model: "models/gemini-2.5-flash-preview-native-audio-dialog",
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: this.config.voice || "Aoede",
                    },
                  },
                },
              },
            },
          };
          this.ws?.send(JSON.stringify(setupMessage));
        } catch (setupErr) {
          console.error("Live setup message failed:", setupErr);
          this.config.onError?.("Failed to send setup message");
        }
        // Mic capture starts after server sends setupComplete.
        this.config.onConnect?.();
      };

      this.ws.onmessage = async (event) => {
        await this.handleIncomingMessage(event.data);
      };

      this.ws.onerror = (e: any) => {
        console.error("Gemini Live WebSocket error:", e);
        const errMsg = e?.message || "WebSocket connection failed to connect to Gemini Live";
        this.config.onError?.(errMsg);
      };

      this.ws.onclose = (event) => {
        console.warn("Gemini Live WebSocket closed. Code:", event.code, "Reason:", event.reason, "Clean:", event.wasClean);
        this.cleanup();
        const reason = event.reason || (event.code === 1006 ? "Connection terminated abnormally (1006)" : `Connection closed (${event.code})`);
        this.config.onDisconnect?.(reason);
      };
    } catch (err: any) {
      this.cleanup();
      this.config.onError?.(err.message || "Failed to initialize Live audio session");
      throw err;
    }
  }

  /**
   * Start processing microphone buffer to 16kHz PCM chunks
   */
  private startMicrophoneCapture() {
    if (!this.inputAudioContext || !this.inputSourceNode) return;

    // Use ScriptProcessor for real-time PCM extraction
    const bufferSize = 2048;
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(bufferSize, 1, 1);

    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.isConnected || !this.isSessionReady || this.isMuted || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      const inputData = e.inputBuffer.getChannelData(0);
      
      // Calculate audio power for speaking indicator
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      const isVoiceActive = rms > 0.02;
      this.config.onUserSpeaking?.(isVoiceActive);

      // Convert Float32Array to 16-bit Linear PCM
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      // Convert buffer to Base64
      const bytes = new Uint8Array(pcm16.buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Audio = btoa(binary);

      // Send realtime PCM chunk to Gemini
      const message = {
        realtimeInput: {
          mediaChunks: [
            {
              mimeType: "audio/pcm;rate=16000",
              data: base64Audio,
            },
          ],
        },
      };

      this.ws.send(JSON.stringify(message));
    };

    this.inputSourceNode.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioContext.destination);
  }

  /**
   * Handle server messages from Gemini Live API
   */
  private async handleIncomingMessage(rawData: any) {
    try {
      let dataText = "";
      if (typeof rawData === "string") {
        dataText = rawData;
      } else if (rawData instanceof Blob) {
        dataText = await rawData.text();
      }

      if (!dataText) return;
      const response = JSON.parse(dataText);

      // Handle server setup acknowledgement or errors
      if (response.setupComplete) {
        console.log("Gemini Live Session Setup Complete:", response.setupComplete);
        this.isSessionReady = true;
        this.startMicrophoneCapture();
      }

      if (response.error) {
        console.error("Gemini Live Server Error:", response.error);
        this.config.onError?.(response.error.message || "Gemini Live API error");
      }

      // 1. Handle Interruption (User started speaking while model was replying)
      if (response.serverContent?.interrupted) {
        this.stopActivePlayback();
        this.config.onInterrupted?.();
        return;
      }

      // 2. Handle Model Turn (Audio + Text parts)
      const parts = response.serverContent?.modelTurn?.parts || [];
      for (const part of parts) {
        // Handle incoming text transcription chunks
        if (part.text) {
          this.currentModelTranscript += part.text;
          this.config.onAISpeaking?.(true, part.text);
          this.config.onTranscription?.(this.currentModelTranscript, false, "model");
        }

        // Handle incoming 24kHz PCM audio chunks
        if (part.inlineData && part.inlineData.mimeType?.startsWith("audio/pcm")) {
          this.playPcm24Chunk(part.inlineData.data);
        }
      }

      // 3. Handle Turn Complete
      if (response.serverContent?.turnComplete) {
        if (this.currentModelTranscript) {
          this.config.onTranscription?.(this.currentModelTranscript, true, "model");
          this.currentModelTranscript = "";
        }
        this.config.onAISpeaking?.(false);
      }
    } catch (err) {
      console.error("Error parsing Gemini Live message:", err);
    }
  }

  /**
   * Play 24kHz 16-bit PCM Audio chunk smoothly via Web Audio API
   */
  private playPcm24Chunk(base64Data: string) {
    if (!this.audioContext || !this.outputAnalyser) return;

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    try {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = this.audioContext.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAnalyser);

      const currentTime = this.audioContext.currentTime;
      const startTime = Math.max(currentTime, this.nextPlayTime);
      source.start(startTime);
      this.nextPlayTime = startTime + audioBuffer.duration;

      this.activeAudioSources.push(source);
      source.onended = () => {
        const index = this.activeAudioSources.indexOf(source);
        if (index > -1) {
          this.activeAudioSources.splice(index, 1);
        }
      };
    } catch (err) {
      console.error("Error playing PCM audio chunk:", err);
    }
  }

  /**
   * Instantly flush/stop playing audio buffer queue
   */
  public stopActivePlayback() {
    for (const source of this.activeAudioSources) {
      try {
        source.stop();
        source.disconnect();
      } catch (_) {}
    }
    this.activeAudioSources = [];
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
    this.config.onAISpeaking?.(false);
  }

  /**
   * Send a text message turn over the active live session
   */
  public sendTextMessage(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const message = {
      clientContent: {
        turns: [
          {
            role: "user",
            parts: [{ text }],
          },
        ],
        turnComplete: true,
      },
    };

    this.ws.send(JSON.stringify(message));
    this.config.onTranscription?.(text, true, "user");
  }

  /**
   * Toggle mute state of microphone
   */
  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Cleanup all resources and close connections
   */
  public cleanup() {
    this.isConnected = false;
    this.isSessionReady = false;
    this.stopActivePlayback();

    if (this.scriptProcessor) {
      try {
        this.scriptProcessor.disconnect();
      } catch (_) {}
      this.scriptProcessor = null;
    }

    if (this.inputSourceNode) {
      try {
        this.inputSourceNode.disconnect();
      } catch (_) {}
      this.inputSourceNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.inputAudioContext) {
      try {
        this.inputAudioContext.close();
      } catch (_) {}
      this.inputAudioContext = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (_) {}
      this.audioContext = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch (_) {}
      this.ws = null;
    }

    this.inputAnalyser = null;
    this.outputAnalyser = null;
  }
}
