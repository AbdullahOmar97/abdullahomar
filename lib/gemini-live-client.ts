/**
 * Gemini Live API Web Audio & WebSocket Client
 * Real-time bidirectional voice and text streaming with Gemini Live Multimodal API.
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

/**
 * Resamples any input audio buffer to exactly 16,000Hz PCM
 */
function downsampleTo16k(inputData: Float32Array, inputSampleRate: number): Float32Array {
  if (inputSampleRate === 16000) return inputData;
  const ratio = inputSampleRate / 16000;
  const outputLength = Math.round(inputData.length / ratio);
  const result = new Float32Array(outputLength);
  let offsetResult = 0;
  let offsetInput = 0;

  while (offsetResult < result.length) {
    const nextOffsetInput = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetInput; i < nextOffsetInput && i < inputData.length; i++) {
      accum += inputData[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : inputData[offsetInput] || 0;
    offsetResult++;
    offsetInput = nextOffsetInput;
  }
  return result;
}

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private inputSourceNode: MediaStreamAudioSourceNode | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private workletNode: AudioNode | null = null;
  private silentGainNode: GainNode | null = null;
  
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
   * Initialize audio contexts synchronously during user gesture.
   */
  public async initAudioContexts(): Promise<void> {
    if (this.audioContext && this.audioContext.state !== "closed") {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
      return;
    }

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioCtx();

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    // Output Analyser for Visualizer & Playback
    this.outputAnalyser = this.audioContext.createAnalyser();
    this.outputAnalyser.fftSize = 64;
    this.outputAnalyser.smoothingTimeConstant = 0.8;
    this.outputAnalyser.connect(this.audioContext.destination);

    // Request microphone access
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // Input Source & Analyser for User Visualizer
    this.inputAnalyser = this.audioContext.createAnalyser();
    this.inputAnalyser.fftSize = 64;
    this.inputAnalyser.smoothingTimeConstant = 0.8;

    this.inputSourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.inputSourceNode.connect(this.inputAnalyser);
  }

  /**
   * Connect to Gemini Live API using an ephemeral token.
   */
  public async connect(token: string): Promise<void> {
    if (this.isConnected) return;

    if (!this.audioContext) {
      await this.initAudioContexts();
    }

    try {
      // Connect WebSocket to Gemini Live API (v1beta endpoint for ephemeral tokens)
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(
        token
      )}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        try {
          const setupMessage = {
            setup: {
              model: "models/gemini-2.5-flash-native-audio-latest",
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
   * Process raw input samples to 16kHz PCM and send via WebSocket
   */
  private processAndSendAudio(rawInput: Float32Array, currentSampleRate: number) {
    if (!this.isConnected || !this.isSessionReady || this.isMuted || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    // Calculate audio power for speaking indicator
    let sum = 0;
    for (let i = 0; i < rawInput.length; i++) {
      sum += rawInput[i] * rawInput[i];
    }
    const rms = Math.sqrt(sum / rawInput.length);
    const isVoiceActive = rms > 0.02;
    this.config.onUserSpeaking?.(isVoiceActive);

    // Downsample to exactly 16000Hz PCM required by Gemini API
    const downsampled = downsampleTo16k(rawInput, currentSampleRate);

    // Convert Float32Array to 16-bit Linear PCM (Little Endian)
    const pcm16 = new Int16Array(downsampled.length);
    for (let i = 0; i < downsampled.length; i++) {
      const s = Math.max(-1, Math.min(1, downsampled[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    // Convert buffer to Base64
    const bytes = new Uint8Array(pcm16.buffer, pcm16.byteOffset, pcm16.byteLength);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Audio = btoa(binary);

    // Send realtime PCM chunk to Gemini (raw WebSocket JSON schema: realtimeInput.mediaChunks)
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
  }

  /**
   * Start microphone capture using AudioWorklet (preferred) or ScriptProcessor fallback
   */
  private async startMicrophoneCapture() {
    if (!this.audioContext || !this.inputSourceNode) return;

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume().catch((e) => console.warn("AudioContext resume note:", e));
    }

    const currentSampleRate = this.audioContext.sampleRate;

    // Try AudioWorklet first
    if (typeof AudioWorkletNode !== "undefined" && this.audioContext.audioWorklet) {
      try {
        const workletCode = `
          class PCMRecorderProcessor extends AudioWorkletProcessor {
            constructor() {
              super();
              this.buffer = new Float32Array(2048);
              this.bufferIndex = 0;
            }
            process(inputs) {
              const input = inputs[0];
              if (input && input.length > 0 && input[0]) {
                const channelData = input[0];
                for (let i = 0; i < channelData.length; i++) {
                  this.buffer[this.bufferIndex++] = channelData[i];
                  if (this.bufferIndex >= this.buffer.length) {
                    this.port.postMessage(this.buffer.slice(0));
                    this.bufferIndex = 0;
                  }
                }
              }
              return true;
            }
          }
          registerProcessor('pcm-recorder-processor', PCMRecorderProcessor);
        `;
        const blob = new Blob([workletCode], { type: "application/javascript" });
        const workletUrl = URL.createObjectURL(blob);
        await this.audioContext.audioWorklet.addModule(workletUrl);
        URL.revokeObjectURL(workletUrl);

        const workletNode = new AudioWorkletNode(this.audioContext, "pcm-recorder-processor");
        workletNode.port.onmessage = (e) => {
          const rawInput = e.data as Float32Array;
          this.processAndSendAudio(rawInput, currentSampleRate);
        };

        this.inputSourceNode.connect(workletNode);
        this.workletNode = workletNode;
        return;
      } catch (workletErr) {
        console.warn("AudioWorklet fallback to ScriptProcessor:", workletErr);
      }
    }

    // Fallback: ScriptProcessorNode
    const bufferSize = 4096;
    this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
    this.silentGainNode = this.audioContext.createGain();
    this.silentGainNode.gain.value = 0;

    this.scriptProcessor.onaudioprocess = (e) => {
      const rawInput = e.inputBuffer.getChannelData(0);
      this.processAndSendAudio(rawInput, currentSampleRate);
    };

    this.inputSourceNode.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.silentGainNode);
    this.silentGainNode.connect(this.audioContext.destination);
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
      } else if (rawData instanceof ArrayBuffer) {
        dataText = new TextDecoder().decode(rawData);
      }

      if (!dataText) return;
      const response = JSON.parse(dataText);

      // Handle server setup acknowledgement
      if (response.setupComplete) {
        console.log("Gemini Live Session Setup Complete:", response.setupComplete);
        this.isSessionReady = true;
        await this.startMicrophoneCapture();
      }

      // Handle server errors
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

      // 2. Handle User Speech Transcription (from inputTranscription)
      if (response.serverContent?.inputTranscription?.text) {
        const userText = response.serverContent.inputTranscription.text;
        this.config.onTranscription?.(userText, true, "user");
      }

      // 3. Handle Model Speech Transcription (from outputTranscription)
      if (response.serverContent?.outputTranscription?.text) {
        const text = response.serverContent.outputTranscription.text;
        this.currentModelTranscript += text;
        this.config.onAISpeaking?.(true, text);
        this.config.onTranscription?.(this.currentModelTranscript, false, "model");
      }

      // 4. Handle Model Turn (Audio + Text parts)
      const parts = response.serverContent?.modelTurn?.parts || [];
      for (const part of parts) {
        if (part.text) {
          this.currentModelTranscript += part.text;
          this.config.onAISpeaking?.(true, part.text);
          this.config.onTranscription?.(this.currentModelTranscript, false, "model");
        }

        // Handle incoming audio chunks (24kHz PCM)
        if (part.inlineData?.data) {
          await this.playPcm24Chunk(part.inlineData.data);
        }
      }

      // 5. Handle Turn Complete
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
  private async playPcm24Chunk(base64Data: string) {
    if (!this.audioContext || !this.outputAnalyser) return;

    try {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const sampleCount = Math.floor(len / 2);
      if (sampleCount === 0) return;

      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Decode 16-bit little-endian PCM to Float32 [-1.0, 1.0]
      const float32 = new Float32Array(sampleCount);
      const dataView = new DataView(bytes.buffer, bytes.byteOffset, len);
      for (let i = 0; i < sampleCount; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        float32[i] = int16 < 0 ? int16 / 32768.0 : int16 / 32767.0;
      }

      // Web Audio API automatically resamples 24kHz buffer to destination hardware rate seamlessly
      const audioBuffer = this.audioContext.createBuffer(1, sampleCount, 24000);
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

    if (this.workletNode) {
      try {
        this.workletNode.disconnect();
      } catch (_) {}
      this.workletNode = null;
    }

    if (this.scriptProcessor) {
      try {
        this.scriptProcessor.disconnect();
      } catch (_) {}
      this.scriptProcessor = null;
    }

    if (this.silentGainNode) {
      try {
        this.silentGainNode.disconnect();
      } catch (_) {}
      this.silentGainNode = null;
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

    if (this.audioContext && this.audioContext.state !== "closed") {
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
