import React, { useState } from "react";
import { MonitorPlay, Focus, RefreshCw } from "lucide-react";

interface Props {
  remediatedCode: string;
  originalCode: string;
}

export const LivePreview: React.FC<Props> = ({ remediatedCode, originalCode }) => {
  const [activeTab, setActiveTab] = useState<"remediated" | "original">("remediated");
  const [highlightFocus, setHighlightFocus] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const currentCode = activeTab === "remediated" ? remediatedCode : originalCode;

  // Wrap html with standard styling and optional focus outline highlight
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: transparent;
            color: #0f172a;
            padding: 1.5rem;
            margin: 0;
          }
          ${
            highlightFocus
              ? `
              *:focus-visible {
                outline: 3px solid #3b82f6 !important;
                outline-offset: 3px !important;
                box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.4) !important;
              }
              `
              : ""
          }
        </style>
      </head>
      <body>
        <div id="preview-root">
          ${currentCode}
        </div>
      </body>
    </html>
  `;

  return (
    <section aria-labelledby="live-preview-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 id="live-preview-heading" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            Live Accessible Sandbox
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Interactive playground to test keyboard navigation, focus traps, and screen-reader semantics
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switch */}
          <div
            role="group"
            aria-label="Preview source toggle"
            className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs"
          >
            <button
              type="button"
              aria-pressed={activeTab === "remediated"}
              onClick={() => setActiveTab("remediated")}
              className={`px-3 py-1 font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                activeTab === "remediated"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Remediated Preview
            </button>
            <button
              type="button"
              aria-pressed={activeTab === "original"}
              onClick={() => setActiveTab("original")}
              className={`px-3 py-1 font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                activeTab === "original"
                  ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Original Preview
            </button>
          </div>

          {/* Toggle focus ring indicator */}
          <button
            type="button"
            onClick={() => setHighlightFocus(!highlightFocus)}
            aria-pressed={highlightFocus}
            aria-label="Toggle visible keyboard focus outline helper"
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
              highlightFocus
                ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                : "bg-white text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
            }`}
          >
            <Focus className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Focus Rings</span>
          </button>

          {/* Refresh iframe */}
          <button
            type="button"
            onClick={() => setReloadKey(prev => prev + 1)}
            aria-label="Reset live preview container"
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" aria-hidden="true"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" aria-hidden="true"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" aria-hidden="true"></span>
            <span className="ml-2 font-mono text-[11px]">
              {activeTab === "remediated" ? "Accessible Rendering" : "Inaccessible Rendering"}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Tip: Click inside the frame and press Tab / Shift+Tab</span>
        </div>

        <div className="p-2 min-h-[300px]">
          <iframe
            key={reloadKey}
            title="Interactive Component Preview"
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            className="w-full h-80 border-0 rounded-lg bg-white"
          />
        </div>
      </div>
    </section>
  );
};
