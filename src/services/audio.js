import { store } from './store.js';

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.ambientOsc = null;
    this.ambientGain = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    const state = store.getState();
    if (state.audioMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {
      // Audio error ignored
    }
  }

  playHeart() {
    const state = store.getState();
    if (state.audioMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }

  playSuccess() {
    const state = store.getState();
    if (state.audioMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.2);
      });
    } catch (e) {}
  }

  toggleAmbient(enabled) {
    if (!enabled) {
      if (this.ambientOsc) {
        try {
          this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
          setTimeout(() => {
            if (this.ambientOsc) {
              this.ambientOsc.stop();
              this.ambientOsc.disconnect();
              this.ambientOsc = null;
            }
          }, 1000);
        } catch (e) {}
      }
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Deep cosmic drone A1

      this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.03, this.ctx.currentTime + 2);

      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);
      this.ambientOsc.start();
    } catch (e) {}
  }
}

export const soundEffects = new SoundEffects();
