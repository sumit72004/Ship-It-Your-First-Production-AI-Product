import React, { useState } from "react";
import { Check, Copy, Code2, Sparkles, SplitSquareVertical } from "lucide-react";

interface Props {
  originalCode: string;
  remediatedCode: string;
  keyImprovements: string[];
}

export const DiffViewer: React.FC<Props> = ({ originalCode, remediatedCode, keyImprovements }) => {
  const [viewMode, setViewMode] = useState<"remediated" | "original" | "split">("remediated");
  const [copied, setCopied] = useState(false);
  const [copyAnnouncement, setCopyAnnouncement] = useState("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(remediatedCode);
      setCopied(true);
      setCopyAnnouncement("Remediated accessible code copied to clipboard successfully.");
      setTimeout(() => {
        setCopied(false);
        setCopyAnnouncement("");
      }, 3000);
    } catch {
      setCopyAnnouncement("Failed to copy code. Please manually select and copy.");
    }
  };

  return (
    <section aria-labelledby="diff-heading" className="space-y-4">
      {/* Screen reader live announcement */}
      <div aria-live="polite" className="sr-only">
        {copyAnnouncement}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 id="diff-heading" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            Remediated Production Code
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            W3C WCAG 2.1 AA compliant syntax with ARIA attributes and keyboard listeners
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div
            role="group"
            aria-label="Code view options"
            className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs"
          >
            <button
              type="button"
              aria-pressed={viewMode === "remediated"}
              onClick={() => setViewMode("remediated")}
              className={`px-3 py-1 font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                viewMode === "remediated"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Remediated
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "split"}
              onClick={() => setViewMode("split")}
              className={`px-3 py-1 font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                viewMode === "split"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "original"}
              onClick={() => setViewMode("original")}
              className={`px-3 py-1 font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                viewMode === "original"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Original
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy remediated code to clipboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Key Improvements Highlights */}
      {keyImprovements.length > 0 && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">
              Architectural &amp; A11y Transformations
            </h4>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
            {keyImprovements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Display Area */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
        {viewMode === "split" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            <div>
              <div className="px-4 py-2 bg-slate-900/90 text-xs font-mono font-semibold text-rose-400 flex items-center justify-between border-b border-slate-800">
                <span>Original Code (Non-compliant)</span>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
                <code>{originalCode}</code>
              </pre>
            </div>
            <div>
              <div className="px-4 py-2 bg-slate-900/90 text-xs font-mono font-semibold text-emerald-400 flex items-center justify-between border-b border-slate-800">
                <span>Remediated Code (WCAG 2.1 AA)</span>
              </div>
              <pre className="p-4 font-mono text-xs text-emerald-300/90 overflow-x-auto max-h-[460px] leading-relaxed">
                <code>{remediatedCode}</code>
              </pre>
            </div>
          </div>
        ) : viewMode === "remediated" ? (
          <div>
            <div className="px-4 py-2 bg-slate-900/90 text-xs font-mono font-semibold text-emerald-400 flex items-center justify-between border-b border-slate-800">
              <span>Remediated Accessible Code</span>
              <span className="text-[11px] text-slate-400">Ready to ship</span>
            </div>
            <pre className="p-4 font-mono text-xs text-emerald-300/90 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{remediatedCode}</code>
            </pre>
          </div>
        ) : (
          <div>
            <div className="px-4 py-2 bg-slate-900/90 text-xs font-mono font-semibold text-rose-400 flex items-center justify-between border-b border-slate-800">
              <span>Original Non-compliant Input</span>
            </div>
            <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{originalCode}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};
