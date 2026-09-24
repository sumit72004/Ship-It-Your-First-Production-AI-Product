import React, { useState } from "react";
import { WCAGIssue, WCAGPrinciple } from "@/types/accessibility";
import { AlertCircle, AlertOctagon, Info, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

interface Props {
  issues: WCAGIssue[];
}

export const IssuesList: React.FC<Props> = ({ issues }) => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("All");
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIssues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredIssues = issues.filter(issue => {
    if (selectedPrinciple === "All") return true;
    return issue.principle === selectedPrinciple;
  });

  const getSeverityBadge = (severity: WCAGIssue["severity"]) => {
    switch (severity) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <AlertOctagon className="w-3.5 h-3.5" aria-hidden="true" />
            Critical
          </span>
        );
      case "serious":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            Serious
          </span>
        );
      case "moderate":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
            Moderate
          </span>
        );
      case "minor":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
            Minor
          </span>
        );
    }
  };

  const principles: ("All" | WCAGPrinciple)[] = [
    "All",
    "Perceivable",
    "Operable",
    "Understandable",
    "Robust"
  ];

  return (
    <section aria-labelledby="issues-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 id="issues-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Accessibility Violations ({issues.length})
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Categorized by W3C WCAG 2.1 Core Principles (POUR)
          </p>
        </div>

        {/* Filter Tabs with accessible role="tablist" */}
        <div
          role="tablist"
          aria-label="Filter issues by WCAG principle"
          className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
        >
          {principles.map(principle => (
            <button
              key={principle}
              role="tab"
              aria-selected={selectedPrinciple === principle}
              onClick={() => setSelectedPrinciple(principle)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                selectedPrinciple === principle
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {principle}
            </button>
          ))}
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-emerald-300 dark:border-emerald-800 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
            No violations found for this category!
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            This component satisfies accessibility guidelines under {selectedPrinciple}.
          </p>
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label="List of detected accessibility issues">
          {filteredIssues.map((issue, index) => {
            const isExpanded = expandedIssues[issue.id] ?? (index === 0);
            const contentId = `issue-content-${issue.id}`;
            const buttonId = `issue-btn-${issue.id}`;

            return (
              <div
                key={issue.id}
                role="listitem"
                className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm transition-all"
              >
                <button
                  id={buttonId}
                  aria-expanded={isExpanded}
                  aria-controls={contentId}
                  onClick={() => toggleExpand(issue.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(issue.severity)}
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {issue.criterion}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        [{issue.principle}]
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {issue.title}
                    </h4>
                  </div>
                  <div className="text-slate-400 dark:text-slate-500 pt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5" aria-hidden="true" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-xs space-y-3"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        Problem Description:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        Real-World User Impact:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {issue.impact}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                      <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">
                        Remediation Fix:
                      </span>
                      <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-mono text-[11px]">
                        {issue.recommendation}
                      </p>
                    </div>

                    {issue.codeSnippet && (
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Detected in snippet:
                        </span>
                        <pre className="mt-1 p-2 bg-slate-900 text-slate-100 rounded text-[11px] overflow-x-auto font-mono">
                          <code>{issue.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
