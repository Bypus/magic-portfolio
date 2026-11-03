// ─── audio.js ─────────────────────────────────────────────────
// Web Audio FFT analyser with automatic fallback to TextAlive beat data.

class AudioAnalyser {
  constructor() {
    this._ctx = null;
    this._source = null;
    this._analyser = null;
    this._gain = null;
    this._data = null;
    this._ready = false;
    this._corsBlocked = false;
    this._checkFrames = 0;
    this._audioEl = null;

    // Normalized 0..1 bands
    this.bass = 0;
    this.mids = 0;
    this.highs = 0;

    // Fallback state (driven by TextAlive data)
    this._fallbackBeat = 0;
    this._fallbackProgress = 0;
  }

  init(audioElement) {
    this._audioEl = audioElement;
    if (this._ctx) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaElementSource(audioElement);
      const analyser = ctx.createAnalyser();
      const gain = ctx.createGain();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;

      source.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      this._ctx = ctx;
      this._source = source;
      this._analyser = analyser;
      this._gain = gain;
      this._data = new Uint8Array(analyser.frequencyBinCount);
      this._ready = true;
      this._checkFrames = 0;
      this._corsBlocked = false;
    } catch (e) {
      console.warn('[AudioAnalyser] Failed to init Web Audio, using fallback:', e.message);
      this._corsBlocked = true;
    }
  }

  resume() {
    if (this._ctx && this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
  }

  setVolume(v) {
    if (this._gain) this._gain.gain.value = v;
    if (this._audioEl) this._audioEl.volume = v;
  }

  update() {
    if (this._corsBlocked || !this._ready) {
      this._updateFallback();
      return;
    }

    this._analyser.getByteFrequencyData(this._data);

    // CORS detection: if all bins are 0 after 30 frames of playback, audio is cross-origin blocked
    if (this._checkFrames < 60) {
      this._checkFrames++;
      if (this._checkFrames === 60) {
        let sum = 0;
        for (let i = 0; i < this._data.length; i++) sum += this._data[i];
        if (sum === 0) {
          console.warn('[AudioAnalyser] CORS blocked — switching to fallback');
          this._corsBlocked = true;
          this._updateFallback();
          return;
        }
      }
    }

    // Bin layout (fftSize=512 → 256 bins, sampleRate ~44100):
    // Each bin = sampleRate / fftSize ≈ 86 Hz
    // Bass: bins 0-5   (~0-430 Hz)
    // Mids: bins 5-40  (~430-3440 Hz)
    // Highs: bins 40-128 (~3440-11000 Hz)
    const len = this._data.length;
    let bassSum = 0, midsSum = 0, highsSum = 0;
    const bassEnd = Math.min(6, len);
    const midsEnd = Math.min(40, len);
    const highsEnd = Math.min(128, len);

    for (let i = 0; i < bassEnd; i++) bassSum += this._data[i];
    for (let i = bassEnd; i < midsEnd; i++) midsSum += this._data[i];
    for (let i = midsEnd; i < highsEnd; i++) highsSum += this._data[i];

    this.bass = bassSum / (bassEnd * 255);
    this.mids = midsSum / ((midsEnd - bassEnd) * 255);
    this.highs = highsSum / ((highsEnd - midsEnd) * 255);
  }

  // Fallback: synthesize from TextAlive beat/progress data
  _updateFallback() {
    // beatPulse decays quickly — use it for bass simulation
    this.bass = this._fallbackBeat * 0.8;
    this.mids = this._fallbackBeat * 0.5 + this._fallbackProgress * 0.15;
    this.highs = this._fallbackBeat * 0.3;

    // Decay the fallback beat
    this._fallbackBeat *= 0.88;
  }

  setFallbackBeat() {
    this._fallbackBeat = 1;
  }

  setFallbackProgress(p) {
    this._fallbackProgress = p;
  }

  get isFallback() {
    return this._corsBlocked;
  }
}

// Singleton
const audioAnalyser = new AudioAnalyser();
export default audioAnalyser;
