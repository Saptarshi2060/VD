
class SoundController {
  private audioContext: AudioContext | null = null;

  private init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    this.init();
    if (!this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  public playPop() {
    this.playTone(400, 'sine', 0.2, 0.1);
    this.playTone(600, 'sine', 0.1, 0.05);
  }

  public playBoop() {
    this.playTone(880, 'sine', 0.15, 0.05);
  }

  public playSparkle() {
    const tones = [1200, 1500, 1800, 2200];
    tones.forEach((t, i) => {
      setTimeout(() => this.playTone(t, 'sine', 0.5, 0.02), i * 100);
    });
  }

  public playBackground() {
    this.init();
    // Simulate lo-fi piano vibe with slow periodic notes
    const pianoNotes = [261.63, 329.63, 392.00, 493.88]; // C4, E4, G4, B4
    setInterval(() => {
      const note = pianoNotes[Math.floor(Math.random() * pianoNotes.length)];
      this.playTone(note, 'sine', 3, 0.02);
    }, 2000);
    
    // Heartbeat loop
    setInterval(() => {
        this.playTone(60, 'sine', 0.1, 0.03);
        setTimeout(() => this.playTone(50, 'sine', 0.1, 0.02), 150);
    }, 3000);
  }
}

export default new SoundController();
