export class SpeechSynthesizer {
  private static synth: SpeechSynthesis | null = null;
  private static isSpeaking = false;

  private static getSynth(): SpeechSynthesis | null {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      return window.speechSynthesis;
    }
    return null;
  }

  public static speak(text: string, onEnd?: () => void, onStart?: () => void): void {
    const synth = this.getSynth();
    if (!synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    synth.speak(utterance);
  }

  public static stop(): void {
    const synth = this.getSynth();
    if (synth) {
      synth.cancel();
      this.isSpeaking = false;
    }
  }

  public static isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }
}
