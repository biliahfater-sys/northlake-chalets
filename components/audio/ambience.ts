/**
 * Generative alpine score — no audio files, no licences, no loop seam.
 * The mood: an evening chalet above the lake. Four layers under one master:
 *
 *   pads   — a slow four-chord progression (Am9 → Fmaj9 → Cmaj9 → G6/9),
 *            two barely-detuned triangles per voice behind a dark lowpass,
 *            crossfading every ~18s so the harmony breathes instead of loops
 *   piano  — sparse felt-piano notes (sine + soft harmonics, long decay)
 *            drawn from the current chord, gently panned
 *   air    — very quiet brown noise through a slowly-breathing lowpass:
 *            wind off the water, more felt than heard
 *   space  — everything runs through a generated convolution reverb
 *            (~4s decay) so the score sits in a large, expensive room
 *
 * Built lazily inside a user gesture to satisfy autoplay rules. Master gain
 * fades as a single breath; `duck()`/`restore()` let the film modal lower the
 * score without stopping it.
 */

const LEVEL = 0.11; // intentionally low — atmosphere, not foreground

/** Chord progression as frequency sets (A minor world, warm and unresolved). */
const CHORDS: number[][] = [
  // Am9: A2 E3 C4 B4
  [110.0, 164.81, 261.63, 493.88],
  // Fmaj9: F2 C3 E4 G4
  [87.31, 130.81, 329.63, 392.0],
  // Cmaj9: C3 G3 E4 D5
  [130.81, 196.0, 329.63, 587.33],
  // G6/9: G2 D3 B3 E4
  [98.0, 146.83, 246.94, 329.63],
];

/** Piano pool per chord — chord tones an octave up, pentatonic-safe. */
const PIANO_NOTES: number[][] = [
  [440.0, 523.25, 659.25, 987.77],
  [349.23, 523.25, 659.25, 783.99],
  [523.25, 659.25, 783.99, 1174.66],
  [392.0, 493.88, 659.25, 880.0],
];

const CHORD_SECONDS = 18;

export class Ambience {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private padVoices: { gain: GainNode }[] = [];
  private chordIndex = 0;
  private chordTimer: ReturnType<typeof setTimeout> | null = null;
  private pianoTimer: ReturnType<typeof setTimeout> | null = null;
  private ducked = false;

  get running() {
    return !!this.ctx && this.ctx.state === "running";
  }

  async start() {
    if (this.ctx) {
      await this.ctx.resume();
      this.fadeTo(this.ducked ? LEVEL * 0.25 : LEVEL, 3);
      this.scheduleChordChange();
      this.schedulePiano();
      return;
    }

    const ctx = new AudioContext();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    // --- space: generated impulse response → convolution reverb ------------
    const reverb = ctx.createConvolver();
    reverb.buffer = this.makeImpulse(ctx, 4.2, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    const dry = ctx.createGain();
    dry.gain.value = 0.7;

    const bus = ctx.createGain();
    bus.gain.value = 1;
    bus.connect(dry).connect(master);
    bus.connect(reverb).connect(wet).connect(master);
    this.bus = bus;

    // --- pads: two detuned triangles per chord voice ------------------------
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 640;
    padFilter.Q.value = 0.4;

    const padBreath = ctx.createOscillator();
    padBreath.frequency.value = 0.035; // one slow swell per ~28s
    const padBreathDepth = ctx.createGain();
    padBreathDepth.gain.value = 160;
    padBreath.connect(padBreathDepth).connect(padFilter.frequency);
    padBreath.start();

    const padBus = ctx.createGain();
    padBus.gain.value = 0.5;
    padFilter.connect(padBus).connect(bus);

    for (let v = 0; v < 4; v++) {
      const voiceGain = ctx.createGain();
      voiceGain.gain.value = 0;
      voiceGain.connect(padFilter);
      for (const detune of [-4, 4]) {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = CHORDS[0][v];
        osc.detune.value = detune;
        osc.connect(voiceGain);
        osc.start();
        // stash oscillators on the gain node for retuning
        (voiceGain as unknown as { oscs?: OscillatorNode[] }).oscs ??= [];
        (voiceGain as unknown as { oscs: OscillatorNode[] }).oscs.push(osc);
      }
      this.padVoices.push({ gain: voiceGain });
    }
    this.applyChord(0, true);

    // --- air: barely-there wind off the lake --------------------------------
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 320;
    windFilter.Q.value = 0.5;

    const windLfo = ctx.createOscillator();
    windLfo.frequency.value = 0.05;
    const windLfoDepth = ctx.createGain();
    windLfoDepth.gain.value = 120;
    windLfo.connect(windLfoDepth).connect(windFilter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.value = 0.16;
    noise.connect(windFilter).connect(windGain).connect(bus);
    noise.start();
    windLfo.start();

    this.fadeTo(LEVEL, 4);
    this.scheduleChordChange();
    this.schedulePiano();
  }

  async stop() {
    if (!this.ctx || !this.master) return;
    this.clearTimers();
    this.fadeTo(0, 1.6);
    const ctx = this.ctx;
    setTimeout(() => {
      if (ctx.state === "running") ctx.suspend();
    }, 1900);
  }

  /** Lower the score (film modal open) without losing its place. */
  duck() {
    this.ducked = true;
    if (this.running) this.fadeTo(LEVEL * 0.25, 1.2);
  }

  restore() {
    this.ducked = false;
    if (this.running) this.fadeTo(LEVEL, 2);
  }

  private clearTimers() {
    if (this.chordTimer) clearTimeout(this.chordTimer);
    if (this.pianoTimer) clearTimeout(this.pianoTimer);
    this.chordTimer = null;
    this.pianoTimer = null;
  }

  private fadeTo(value: number, seconds: number) {
    if (!this.ctx || !this.master) return;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(value, this.ctx.currentTime, seconds / 3);
  }

  /** Exponentially-decaying noise burst = a credible large-room IR. */
  private makeImpulse(ctx: AudioContext, seconds: number, decay: number) {
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** decay;
      }
    }
    return buf;
  }

  /** Crossfade pad voices to the next chord; retune behind the fade. */
  private applyChord(index: number, immediate = false) {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = CHORDS[index];
    this.padVoices.forEach((voice, v) => {
      const oscs =
        (voice.gain as unknown as { oscs?: OscillatorNode[] }).oscs ?? [];
      const g = voice.gain.gain;
      if (immediate) {
        for (const osc of oscs) {
          osc.frequency.setValueAtTime(freqs[v], now);
        }
        g.setTargetAtTime(0.22, now, 2);
        return;
      }
      // breathe out, retune in the trough, breathe back in
      g.cancelScheduledValues(now);
      g.setTargetAtTime(0.04, now, 1.6);
      for (const osc of oscs) {
        osc.frequency.setTargetAtTime(freqs[v], now + 3.5, 0.4);
      }
      g.setTargetAtTime(0.22, now + 5, 2.4);
    });
  }

  private scheduleChordChange() {
    if (this.chordTimer) clearTimeout(this.chordTimer);
    this.chordTimer = setTimeout(() => {
      this.chordIndex = (this.chordIndex + 1) % CHORDS.length;
      this.applyChord(this.chordIndex);
      this.scheduleChordChange();
    }, CHORD_SECONDS * 1000);
  }

  private schedulePiano() {
    if (this.pianoTimer) clearTimeout(this.pianoTimer);
    const delay = 6000 + Math.random() * 9000;
    this.pianoTimer = setTimeout(() => {
      this.playPiano();
      this.schedulePiano();
    }, delay);
  }

  /** One soft felt-piano note: fundamental + two fading harmonics. */
  private playPiano() {
    const ctx = this.ctx;
    if (!ctx || !this.bus || ctx.state !== "running") return;
    const pool = PIANO_NOTES[this.chordIndex];
    const freq = pool[Math.floor(Math.random() * pool.length)];
    const now = ctx.currentTime;

    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.1 - 0.55;
    pan.connect(this.bus);

    const partials: Array<[number, number]> = [
      [1, 0.05],
      [2, 0.016],
      [3, 0.006],
    ];
    for (const [mult, level] of partials) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq * mult;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      // felt hammer: quick-but-soft attack, very long release
      g.gain.linearRampToValueAtTime(level, now + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 7 - mult);
      osc.connect(g).connect(pan);
      osc.start(now);
      osc.stop(now + 7.2);
    }
  }
}
