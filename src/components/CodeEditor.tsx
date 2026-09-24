import React from "react";
import { SAMPLE_SNIPPETS } from "@/data/sampleSnippets";
import { Sparkles, Code2, RotateCcw, AlertTriangle } from "lucide-react";

interface Props {
  code: string;
  onChange: (value: string) => void;
  onAudit: () => void;
  loading: boolean;
  onSelectPreset: (presetId: string) => void;
  selectedPresetId: string;
}

export const CodeEditor: React.FC<Props> = ({
  code,
  onChange,
  onAudit,
  loading,
  onSelectPreset,
  selectedPresetId,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to run audit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!loading && code.trim().length > 0) {
        onAudit();
      }
    }
  };

  return (
    <section aria-labelledby="editor-heading" className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 id="editor-heading" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            Input Component or HTML Snippet
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Paste your HTML, JSX, or choose an inaccessible scenario preset below
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="preset-select" className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Preset:
          </label>
          <select
            id="preset-select"
            value={selectedPresetId}
            onChange={e => onSelectPreset(e.target.value)}
            className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            {SAMPLE_SNIPPETS.map(preset => (
              <option key={preset.id} value={preset.id}>
                {preset.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Box */}
      <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-slate-950 focus-within:ring-2 focus-within:ring-blue-600">
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">HTML / JSX Editor</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>{code.length} characters</span>
            <span className="hidden sm:inline text-slate-500">Ctrl+Enter to Run</span>
          </div>
        </div>

        <label htmlFor="code-textarea" className="sr-only">
          HTML or JSX Component Code to Remediate
        </label>
        <textarea
          id="code-textarea"
          value={code}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste or write your HTML / JSX markup here..."
          rows={10}
          spellCheck={false}
          className="w-full p-4 font-mono text-xs bg-transparent text-slate-200 resize-y focus:outline-none leading-relaxed"
        />
      </div>

      {/* Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => onChange("")}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Clear Editor</span>
        </button>

        <button
          type="button"
          disabled={loading || code.trim().length === 0}
          onClick={onAudit}
          aria-label={loading ? "Analyzing component accessibility..." : "Audit and Remediate with AI"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:outline-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing &amp; Remediating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span>Audit &amp; Remediate with AI</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
