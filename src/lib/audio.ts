/** Web Audio 기반 효과음. 외부 파일 없이 동작. 배경음악은 없음. */
class Sound {
  private ctx: AudioContext | null = null;
  enabled = true;

  private get audio(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.08) {
    const ctx = this.audio;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + dur + 0.05);
  }

  click() {
    this.tone(880, 0, 0.06, 'sine', 0.04);
  }
  doorBell() {
    this.tone(1318, 0, 0.5, 'sine', 0.07);
    this.tone(1760, 0.18, 0.7, 'sine', 0.06);
  }
  soft() {
    this.tone(660, 0, 0.18, 'triangle', 0.05);
    this.tone(880, 0.09, 0.22, 'triangle', 0.04);
  }
  low() {
    this.tone(330, 0, 0.22, 'triangle', 0.04);
  }
  info() {
    this.tone(1046, 0, 0.12, 'sine', 0.05);
    this.tone(1318, 0.08, 0.16, 'sine', 0.05);
  }
  complete() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * 0.11, 0.35, 'triangle', 0.07));
  }
}

export const sound = new Sound();
