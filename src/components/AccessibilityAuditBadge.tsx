import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Award } from "lucide-react";
import { AccessibilityResult } from "@/types/accessibility";

interface Props {
  score: number;
  level: AccessibilityResult["complianceLevel"];
  issuesCount: number;
}

export const AccessibilityAuditBadge: React.FC<Props> = ({ score, level, issuesCount }) => {
  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-emerald-500 border-emerald-500/40 bg-emerald-500/10";
    if (s >= 75) return "text-blue-500 border-blue-500/40 bg-blue-500/10";
    if (s >= 50) return "text-amber-500 border-amber-500/40 bg-amber-500/10";
    return "text-rose-500 border-rose-500/40 bg-rose-500/10";
  };

  const getStatusIcon = (s: number) => {
    if (s >= 90) return <Award className="w-6 h-6 text-emerald-500" aria-hidden="true" />;
    if (s >= 75) return <ShieldCheck className="w-6 h-6 text-blue-500" aria-hidden="true" />;
    if (s >= 50) return <AlertTriangle className="w-6 h-6 text-amber-500" aria-hidden="true" />;
    return <ShieldAlert className="w-6 h-6 text-rose-500" aria-hidden="true" />;
  };

  return (
    <div
      role="region"
      aria-label="Accessibility Compliance Scorecard"
      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl border ${getScoreColor(score)} flex items-center justify-center`}>
          {getStatusIcon(score)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white" aria-label={`Accessibility score: ${score} out of 100`}>
              {score}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              / 100
            </span>
            <span
              className={`ml-2 px-2.5 py-0.5 text-xs font-bold rounded-full border ${getScoreColor(score)}`}
              role="status"
            >
              {level}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {issuesCount === 0
              ? "All WCAG 2.1 AA success criteria satisfied"
              : `${issuesCount} WCAG accessibility violation${issuesCount === 1 ? "" : "s"} identified`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
          <span>WCAG 2.1 AAA &ge;95</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" aria-hidden="true"></span>
          <span>AA Target &ge;80</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" aria-hidden="true"></span>
          <span>Below AA &lt;80</span>
        </div>
      </div>
    </div>
  );
};
