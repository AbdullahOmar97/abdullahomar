/**
 * Audio Analyser for 3D Visualizer
 */
export class Analyser {
  public analyser: AnalyserNode;
  private bufferLength = 0;
  private dataArray: Uint8Array;
  private smoothedLevel = 0;

  constructor(node: AudioNode) {
    if (node instanceof AnalyserNode) {
      this.analyser = node;
    } else {
      this.analyser = node.context.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      try {
        node.connect(this.analyser);
      } catch (_) {}
    }
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  update(): number {
    this.analyser.getByteFrequencyData(this.dataArray as any);
    
    // Compute average energy across frequencies
    let sum = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      sum += this.dataArray[i];
    }
    const avg = this.bufferLength > 0 ? sum / this.bufferLength / 255 : 0;
    this.smoothedLevel = this.smoothedLevel * 0.7 + avg * 0.3;
    return this.smoothedLevel;
  }

  get data(): Uint8Array {
    return this.dataArray;
  }

  get level(): number {
    return this.smoothedLevel;
  }
}
