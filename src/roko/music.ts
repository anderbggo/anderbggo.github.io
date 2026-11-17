/**
 * Ambient lullaby synthesised with the Web Audio API: no audio file, so there is no seam to hear when it loops.
 * A four-chord cycle of soft pads (each chord fades into the next) under a music-box melody, through a reverb.
 */

const beat = 60 / 64;
const beatsPerChord = 8;
const chordLength = beat * beatsPerChord;
const lookAhead = 2.5;
const masterVolume = 0.4;

type Chord = { pad: number[]; bass: number; melody: Array<readonly [beat: number, midi: number]> };

const cycle: Chord[] = [
  {
    pad: [55, 60, 64, 71],
    bass: 36,
    melody: [[0, 76], [1.5, 74], [2, 72], [4, 79], [6, 76]],
  },
  {
    pad: [57, 60, 64, 67],
    bass: 33,
    melody: [[0, 81], [1, 79], [2, 76], [4, 74], [5, 76], [6, 72]],
  },
  {
    pad: [57, 60, 64, 65],
    bass: 29,
    melody: [[0, 81], [2, 79], [3, 77], [4, 76], [6, 72]],
  },
  {
    pad: [55, 59, 62, 67],
    bass: 31,
    melody: [[0, 74], [1, 79], [2, 74], [4, 71], [5, 74], [6, 79]],
  },
];

const frequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function createReverb(context: AudioContext) {
  const seconds = 4;
  const length = Math.floor(context.sampleRate * seconds);
  const impulse = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let index = 0; index < length; index++) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / length) ** 3;
    }
  }
  const convolver = context.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

export class Lullaby {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private dry: AudioNode | null = null;
  private wet: AudioNode | null = null;
  private timer: number | undefined;
  private nextChordAt = 0;
  private chordIndex = 0;

  get playing() {
    return this.timer !== undefined;
  }

  async start() {
    if (this.playing) return;
    if (!this.context) this.build();
    const context = this.context!;
    await context.resume();

    const now = context.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(masterVolume, now + 2.5);

    this.nextChordAt = Math.max(this.nextChordAt, now + 0.1);
    this.schedule();
    this.timer = window.setInterval(() => this.schedule(), 400);
  }

  stop() {
    if (!this.context || !this.playing) return;
    window.clearInterval(this.timer);
    this.timer = undefined;

    const context = this.context;
    const now = context.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(0, now + 1.2);
    // Once silent, drop everything that was queued so a later start begins cleanly.
    window.setTimeout(() => {
      if (this.playing) return;
      void context.close();
      this.context = null;
      this.nextChordAt = 0;
    }, 1400);
  }

  private build() {
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);

    const dry = context.createGain();
    dry.gain.value = 0.7;
    dry.connect(master);

    const reverb = createReverb(context);
    const reverbLevel = context.createGain();
    reverbLevel.gain.value = 0.55;
    reverb.connect(reverbLevel).connect(master);

    this.context = context;
    this.master = master;
    this.dry = dry;
    this.wet = reverb;
  }

  private schedule() {
    const context = this.context;
    if (!context) return;
    while (this.nextChordAt < context.currentTime + lookAhead) {
      const chord = cycle[this.chordIndex % cycle.length];
      // Every other pass through the cycle the melody rests a little, so the loop breathes instead of repeating.
      const sparse = Math.floor(this.chordIndex / cycle.length) % 2 === 1;
      this.playChord(chord, this.nextChordAt, sparse);
      this.nextChordAt += chordLength;
      this.chordIndex++;
    }
  }

  private playChord(chord: Chord, at: number, sparse: boolean) {
    // Pads overlap the next chord by a few seconds so the change is a cross-fade, never a cut.
    const padEnd = at + chordLength + 3;
    chord.pad.forEach((midi) => this.pad(frequency(midi), at, padEnd, 0.05));
    this.pad(frequency(chord.bass), at, padEnd, 0.07);

    chord.melody.forEach(([step, midi], index) => {
      if (sparse && index % 2 === 1) return;
      this.bell(frequency(midi), at + step * beat, sparse ? 0.06 : 0.08);
    });
  }

  private pad(hz: number, start: number, end: number, level: number) {
    const context = this.context!;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(level, start + 2.5);
    gain.gain.setValueAtTime(level, end - 3);
    gain.gain.linearRampToValueAtTime(0, end);

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.connect(gain);
    gain.connect(this.dry!);
    gain.connect(this.wet!);

    [-4, 4].forEach((detune, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = hz;
      oscillator.detune.value = detune;
      oscillator.connect(filter);
      oscillator.start(start);
      oscillator.stop(end + 0.05);
    });
  }

  private bell(hz: number, start: number, level: number) {
    const context = this.context!;
    const decay = 3;
    // A music-box tone: the fundamental plus two quieter, faster-fading overtones.
    [
      [1, 1, decay],
      [2, 0.25, decay * 0.5],
      [3, 0.08, decay * 0.3],
    ].forEach(([ratio, share, length]) => {
      const gain = context.createGain();
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(level * share, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
      gain.connect(this.dry!);
      gain.connect(this.wet!);

      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = hz * ratio;
      oscillator.connect(gain);
      oscillator.start(start);
      oscillator.stop(start + length + 0.05);
    });
  }
}
