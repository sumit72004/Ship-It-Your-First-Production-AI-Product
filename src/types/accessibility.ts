export type WCAGLevel = 'A' | 'AA' | 'AAA';
export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';
export type WCAGPrinciple = 'Perceivable' | 'Operable' | 'Understandable' | 'Robust';

export interface WCAGIssue {
  id: string;
  criterion: string; // e.g. "1.1.1 Non-text Content", "4.1.2 Name, Role, Value"
  principle: WCAGPrinciple;
  level: WCAGLevel;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  impact: string;
  codeSnippet?: string;
}

export interface ScreenReaderStep {
  step: number;
  focusedElement: string;
  announcedText: string;
  keyboardAction: string;
  annotation: string;
}

export interface AccessibilityResult {
  score: number; // 0 - 100
  complianceLevel: 'Non-Compliant' | 'WCAG 2.1 A' | 'WCAG 2.1 AA' | 'WCAG 2.1 AAA';
  summary: string;
  issues: WCAGIssue[];
  remediatedCode: string;
  screenReaderWalkthrough: ScreenReaderStep[];
  keyboardNavigationMap: string[];
  keyImprovements: string[];
  timestamp: string;
  engine: 'Claude 3.5 Sonnet' | 'Smart Fallback Engine (Offline/Edge)';
}

export interface PresetSnippet {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
}
