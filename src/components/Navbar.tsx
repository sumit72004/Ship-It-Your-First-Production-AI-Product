import React, { useState } from "react";
import { Sparkles, Key, Sun, Moon, Github, Check, AlertCircle } from "lucide-react";

interface Props {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<Props> = ({
  apiKey,
  onApiKeyChange,
  isDark,
  onToggleTheme,
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onApiKeyChange(tempKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <>
      {/* Skip link for keyboard users - WCAG 2.4.1 Bypass Blocks */}
      <a
        href="#main-workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  AccessiCraft<span className="text-blue-600 dark:text-blue-400 font-black">AI</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase tracking-wider">
                  v1.0
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
                W3C WCAG 2.1 AA Production Remediation Engine
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Claude API Key Configuration Button */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              aria-label="Configure Anthropic Claude API Key"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              <Key className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="hidden md:inline">
                {apiKey ? "API Key Connected" : "Custom API Key"}
              </span>
              {apiKey && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Custom key configured" />
              )}
            </button>

            {/* Dark / Light High-Contrast Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? "Switch to high-contrast light mode" : "Switch to dark theme"}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
              )}
            </button>

            {/* GitHub Repository Link */}
            <a
              href="https://github.com/sumit72004/Ship-It-Your-First-Production-AI-Product"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View repository on GitHub (opens in new tab)"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyModal && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) setShowKeyModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="api-modal-title"
            aria-describedby="api-modal-desc"
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 id="api-modal-title" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" aria-hidden="true" />
                Anthropic Claude API Key
              </h3>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                aria-label="Close API Key dialog"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                &times;
              </button>
            </div>

            <p id="api-modal-desc" className="text-xs text-slate-600 dark:text-slate-400">
              AccessiCraft AI works out of the box with our offline smart fallback engine. If you want live reasoning directly from <strong>Claude 3.5 Sonnet</strong>, enter your Anthropic API key here. It remains stored strictly in your browser session.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-3">
              <div>
                <label htmlFor="user-anthropic-key" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  API Key (sk-ant-...)
                </label>
                <input
                  id="user-anthropic-key"
                  type="password"
                  value={tempKey}
                  onChange={e => setTempKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempKey("");
                    onApiKeyChange("");
                    setShowKeyModal(false);
                  }}
                  className="text-xs text-slate-500 hover:text-rose-600"
                >
                  Clear Key (Use Fallback Engine)
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Key</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
