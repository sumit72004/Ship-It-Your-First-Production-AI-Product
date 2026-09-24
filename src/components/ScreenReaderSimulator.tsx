import React, { useState, useEffect } from "react";
import { ScreenReaderStep } from "@/types/accessibility";
import { SpeechSynthesizer } from "@/lib/speech";
import { Volume2, VolumeX, Play, Square, Headphones, Keyboard, HelpCircle } from "lucide-react";

interface Props {
  steps: ScreenReaderStep[];
  keyboardNavigationMap: string[];
}

export const ScreenReaderSimulator: React.FC<Props> = ({ steps, keyboardNavigationMap }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(SpeechSynthesizer.isSupported());
    return () => {
      SpeechSynthesizer.stop();
    };
  }, []);

  const handlePlayWalkthrough = () => {
    if (isPlaying) {
      SpeechSynthesizer.stop();
      setIsPlaying(false);
      setActiveStepIndex(null);
      return;
    }

    if (steps.length === 0) return;

    setIsPlaying(true);
    let currentIndex = 0;

    const speakNext = () => {
      if (currentIndex >= steps.length) {
        setIsPlaying(false);
        setActiveStepIndex(null);
        return;
      }

      setActiveStepIndex(currentIndex);
      const step = steps[currentIndex];
      const textToSpeak = `Step ${step.step}. ${step.focusedElement}. Keyboard action: ${step.keyboardAction}. Screen reader announces: ${step.announcedText}`;

      SpeechSynthesizer.speak(
        textToSpeak,
        () => {
          currentIndex++;
          // Small pause between steps
          setTimeout(speakNext, 500);
        },
        () => {
          // started
        }
      );
    };

    speakNext();
  };

  const handlePlaySingleStep = (index: number) => {
    SpeechSynthesizer.stop();
    setIsPlaying(true);
    setActiveStepIndex(index);

    const step = steps[index];
    const textToSpeak = `Focused on ${step.focusedElement}. Screen reader vocalizes: ${step.announcedText}`;

    SpeechSynthesizer.speak(textToSpeak, () => {
      setIsPlaying(false);
      setActiveStepIndex(null);
    });
  };

  return (
    <section aria-labelledby="screen-reader-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 id="screen-reader-heading" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            Screen Reader &amp; Keyboard Simulator
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Audio simulation of NVDA, JAWS, &amp; VoiceOver announcement sequencing
          </p>
        </div>

        {isSupported && (
          <button
            type="button"
            onClick={handlePlayWalkthrough}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Stop screen reader audio preview" : "Listen to full screen reader audio walkthrough"}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-600 focus-visible:outline-none ${
              isPlaying
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Stop Vocalizer</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Listen Audio Walkthrough</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Keyboard Navigation Mapping */}
      {keyboardNavigationMap.length > 0 && (
        <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2 mb-2">
            <Keyboard className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200">
              Deterministic Keyboard Tab Trajectory
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {keyboardNavigationMap.map((mapItem, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold shrink-0">&bull;</span>
                <span>{mapItem}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step by step announcement transcript */}
      <div className="space-y-2.5" role="feed" aria-label="Screen reader announcement steps">
        {steps.map((step, idx) => {
          const isActive = activeStepIndex === idx;

          return (
            <article
              key={step.step}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive
                  ? "border-purple-500 bg-purple-500/10 shadow-md ring-2 ring-purple-500/30"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {step.step}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {step.focusedElement}
                    </h5>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Key: {step.keyboardAction}
                    </span>
                  </div>
                </div>

                {isSupported && (
                  <button
                    type="button"
                    onClick={() => handlePlaySingleStep(idx)}
                    aria-label={`Play audio announcement for step ${step.step}: ${step.focusedElement}`}
                    className="p-1.5 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:outline-none"
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Vocalized speech box */}
              <div className="mt-2.5 p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Screen Reader Vocalization:</div>
                <p>&ldquo;{step.announcedText}&rdquo;</p>
              </div>

              <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-purple-500 shrink-0" aria-hidden="true" />
                <span>{step.annotation}</span>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};
