"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CodeEditor } from "@/components/CodeEditor";
import { AccessibilityAuditBadge } from "@/components/AccessibilityAuditBadge";
import { IssuesList } from "@/components/IssuesList";
import { DiffViewer } from "@/components/DiffViewer";
import { ScreenReaderSimulator } from "@/components/ScreenReaderSimulator";
import { LivePreview } from "@/components/LivePreview";
import { ColorContrastTester } from "@/components/ColorContrastTester";
import { ExportModal } from "@/components/ExportModal";
import { SAMPLE_SNIPPETS } from "@/data/sampleSnippets";
import { AccessibilityResult } from "@/types/accessibility";
import { analyzeAccessibilityHeuristics } from "@/lib/heuristicA11y";
import { Code2, ListChecks, Headphones, MonitorPlay, Palette, Download, Sparkles, CheckCircle, Info } from "lucide-react";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState(SAMPLE_SNIPPETS[0].id);
  const [inputCode, setInputCode] = useState(SAMPLE_SNIPPETS[0].code);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AccessibilityResult | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "issues" | "screenreader" | "preview" | "contrast">("code");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  // Initialize theme and run initial audit
  useEffect(() => {
    // Check saved API key in localStorage
    const savedKey = localStorage.getItem("accessicraft_api_key");
    if (savedKey) setApiKey(savedKey);

    // Run initial analysis using deterministic engine
    const initialResult = analyzeAccessibilityHeuristics(SAMPLE_SNIPPETS[0].code);
    setResult(initialResult);
  }, []);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem("accessicraft_api_key", newKey);
    } else {
      localStorage.removeItem("accessicraft_api_key");
    }
  };

  const handleToggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = SAMPLE_SNIPPETS.find(p => p.id === presetId);
    if (found) {
      setInputCode(found.code);
      setNotice(null);
    }
  };

  const handleRunAudit = async () => {
    if (!inputCode.trim()) return;

    setLoading(true);
    setNotice(null);
    setLiveAnnouncement("Auditing component markup for accessibility violations...");

    try {
      const response = await fetch("/api/remediate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: inputCode,
          userApiKey: apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: AccessibilityResult & { notice?: string } = await response.json();
      setResult(data);

      if (data.notice) {
        setNotice(data.notice);
      }

      setLiveAnnouncement(
        `Audit complete. Score: ${data.score} out of 100. ${data.issues.length} violations found.`
      );
    } catch (err: unknown) {
      console.warn("Falling back to local heuristic analyzer:", err);
      const fallback = analyzeAccessibilityHeuristics(inputCode);
      setResult(fallback);
      setNotice("API request interrupted. AccessiCraft's offline heuristic engine performed the audit.");
      setLiveAnnouncement(
        `Audit finished via fallback. Score: ${fallback.score} out of 100. ${fallback.issues.length} violations identified.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Screen reader live updates announcer */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <main id="main-workspace" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 focus:outline-none">
        {/* Hero Banner */}
        <section aria-label="Overview banner" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  WCAG 2.1 AA Production Engine
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Claude 3.5 Sonnet + Offline Resilient Parser
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Turn Inaccessible Code into Production-Ready UI
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Automated accessibility linters miss ~70% of semantic context. AccessiCraft AI performs deep WCAG 2.1 compliance audits, repairs ARIA bindings, restores keyboard navigation, and generates live screen reader audio simulations.
              </p>
            </div>

            {result && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  aria-label="Export audit report in Markdown or JSON format"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                >
                  <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>Export Report</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Engine Notice Alert */}
        {notice && (
          <div
            role="status"
            className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5"
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <p className="flex-1">{notice}</p>
          </div>
        )}

        {/* Input & Quick preset section */}
        <CodeEditor
          code={inputCode}
          onChange={setInputCode}
          onAudit={handleRunAudit}
          loading={loading}
          onSelectPreset={handleSelectPreset}
          selectedPresetId={selectedPresetId}
        />

        {/* Results Section */}
        {result && (
          <div className="space-y-6 pt-2">
            {/* Scorecard */}
            <AccessibilityAuditBadge
              score={result.score}
              level={result.complianceLevel}
              issuesCount={result.issues.length}
            />

            {/* Navigation Tabs */}
            <div
              role="tablist"
              aria-label="Audit result views"
              className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2"
            >
              <button
                role="tab"
                aria-selected={activeTab === "code"}
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                  activeTab === "code"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Code2 className="w-4 h-4" aria-hidden="true" />
                <span>Remediated Code</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "issues"}
                onClick={() => setActiveTab("issues")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                  activeTab === "issues"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <ListChecks className="w-4 h-4" aria-hidden="true" />
                <span>Violations ({result.issues.length})</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "screenreader"}
                onClick={() => setActiveTab("screenreader")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                  activeTab === "screenreader"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Headphones className="w-4 h-4" aria-hidden="true" />
                <span>Screen Reader Audio</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "preview"}
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                  activeTab === "preview"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <MonitorPlay className="w-4 h-4" aria-hidden="true" />
                <span>Interactive Sandbox</span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "contrast"}
                onClick={() => setActiveTab("contrast")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                  activeTab === "contrast"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Palette className="w-4 h-4" aria-hidden="true" />
                <span>Contrast &amp; Vision Sim</span>
              </button>
            </div>

            {/* Active Tab Content */}
            <div className="pt-2">
              {activeTab === "code" && (
                <DiffViewer
                  originalCode={inputCode}
                  remediatedCode={result.remediatedCode}
                  keyImprovements={result.keyImprovements}
                />
              )}

              {activeTab === "issues" && (
                <IssuesList issues={result.issues} />
              )}

              {activeTab === "screenreader" && (
                <ScreenReaderSimulator
                  steps={result.screenReaderWalkthrough}
                  keyboardNavigationMap={result.keyboardNavigationMap}
                />
              )}

              {activeTab === "preview" && (
                <LivePreview
                  remediatedCode={result.remediatedCode}
                  originalCode={inputCode}
                />
              )}

              {activeTab === "contrast" && (
                <ColorContrastTester />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">AccessiCraft AI</span>
            <span>&bull;</span>
            <span>Production-Ready AI-Enhanced Frontend Application</span>
          </div>
          <div className="flex items-center gap-4">
            <span>WCAG 2.1 AA Compliant</span>
            <span>&bull;</span>
            <a
              href="https://github.com/sumit72004/Ship-It-Your-First-Production-AI-Product"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub Source
            </a>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      {result && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          result={result}
          inputCode={inputCode}
        />
      )}
    </div>
  );
}
