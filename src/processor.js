const BUFFER_SIZE = 64;

class Processor {
  constructor() {
    this.player = null;
    this.audioprocess = null;
    this.isPlaying = false;
    this.streams = null;
    this.buffers = null;
  }

  get env() {
    return this.player.env;
  }

  get sampleRate() {
    return this.player.sampleRate;
  }

  get bufferSize() {
    return BUFFER_SIZE;
  }

  bind(Klass) {
    this.player = new Klass(this);
  }

  play(audioprocess) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.streams = [
        new Float32Array(this.player.bufferLength),
        new Float32Array(this.player.bufferLength),
      ];
      this.buffers = [
        new Float32Array(BUFFER_SIZE),
        new Float32Array(BUFFER_SIZE),
      ];
      this.audioprocess = audioprocess;
      this.player.play();
    }
  }

  pause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.player.pause();
      this.streams = null;
      this.buffers = null;
      this.audioprocess = null;
    }
  }

  process(bufL, bufR) {
    let audioprocess = this.audioprocess;
    let buffers = this.buffers;
    let bufferL = buffers[0];
    let bufferR = buffers[1];
    let n = bufL.length / BUFFER_SIZE;

    for (let i = 0; i < n; i++) {
      audioprocess({
        bufferSize: BUFFER_SIZE,
        buffers: buffers,
      });
      bufL.set(bufferL, i * BUFFER_SIZE);
      bufR.set(bufferR, i * BUFFER_SIZE);
    }
  }
}

module.exports = Processor;
