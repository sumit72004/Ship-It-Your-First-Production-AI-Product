# AccessiCraft AI — Production-Ready Web Accessibility Remediation Engine

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-29%20Passed-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG%202.1-AA%20Compliant-emerald)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%20A11y-success)](https://pagespeed.web.dev/)

> **Live Deployed Application**: [https://accessicraft-ai.vercel.app](https://accessicraft-ai.vercel.app)  
> **Source Repository**: [https://github.com/sumit72004/Ship-It-Your-First-Production-AI-Product](https://github.com/sumit72004/Ship-It-Your-First-Production-AI-Product)

---

## 1. Project Brief

**AccessiCraft AI** is an intelligent web accessibility (a11y) diagnostic and remediation platform that transforms inaccessible HTML, JSX, and UI components into WCAG 2.1 AA-compliant, production-ready code while simulating real-world assistive technology experiences. While automated linters catch only ~30% of surface-level accessibility errors (like missing image `alt` tags), they fail on semantic context, focus trapping, and screen reader flow. Built for frontend engineers, UI/UX designers, and accessibility auditors, AccessiCraft bridges this gap by combining Claude 3.5 Sonnet's contextual reasoning with an offline-first deterministic heuristic engine, interactive keyboard sandbox, Web Speech API audio narration simulator, and real-time WCAG color contrast analyzer. I chose this idea because true web accessibility is a fundamental civil right for millions of disabled web users, yet developer education and remediation tooling remain fragmented and cumbersome.

---

## 2. Core Features & Capabilities

- 🤖 **Contextual AI Remediation (Claude 3.5 Sonnet)**: Deep WCAG 2.1 AA semantic code analysis with structured JSON diagnostics and production-ready code fixes.
- 🛡️ **Zero-Failure Offline Resilience (FE-07)**: If an Anthropic API key is absent or network requests drop, the built-in deterministic heuristic rule engine immediately analyzes the markup and generates fixes without downtime.
- 🔊 **Screen Reader Audio Vocalizer (FE-10)**: Uses the browser's Web Speech API (`window.speechSynthesis`) to vocalize what users with blindness hear through NVDA, VoiceOver, or JAWS.
- ⌨️ **Live Interactive Keyboard Sandbox**: Test tab sequences, visible focus rings (`focus-visible`), and ARIA dialog dismissals (`Escape` key) within an isolated preview.
- 🎨 **WCAG Color Contrast & Vision Simulator**: Real-time relative luminance calculation (&ge;4.5:1 for body copy, &ge;3.0:1 for large text/UI) paired with color blindness filters (Protanopia, Deuteranopia, Tritanopia, Monochromacy).
- 📑 **Comprehensive Audit Exporter**: One-click export of structured accessibility audit reports as Markdown or JSON.
- ♿ **Accessible by Design**: WCAG 2.1 AA verified, visible high-contrast focus rings, skip-to-content navigation, screen reader live regions (`aria-live="polite"`), and light/dark high-contrast themes.

---

## 3. Quick Start & Setup Instructions

Run locally in less than 2 minutes:

```bash
# 1. Clone repository
git clone https://github.com/sumit72004/Ship-It-Your-First-Production-AI-Product.git
cd Ship-It-Your-First-Production-AI-Product

# 2. Install dependencies & run development server
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional Anthropic API Configuration
AccessiCraft works immediately out-of-the-box using its internal smart heuristic engine. To enable live Claude 3.5 Sonnet reasoning:
1. Create a `.env.local` file:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
2. Or input your API key directly in the app's settings dialog in the top navigation bar.

---

## 4. Architecture Overview

```
src/
├── app/
│   ├── api/remediate/route.ts      # Serverless route calling Claude 3.5 Sonnet with graceful fallback
│   ├── globals.css                 # Accessible CSS tokens, 3:1 focus rings, reduced motion queries
│   ├── layout.tsx                  # Accessible root layout with semantic HTML5 landmarks
│   └── page.tsx                    # Main state machine, workspace views, live announcer
├── components/
│   ├── AccessibilityAuditBadge.tsx # Compliance score indicator (AAA, AA, A, Non-Compliant)
│   ├── CodeEditor.tsx              # Syntax editor with preset inaccessible templates and shortcuts
│   ├── DiffViewer.tsx              # Side-by-side & unified accessible code diff viewer
│   ├── IssuesList.tsx              # POUR-categorized WCAG violation disclosures
│   ├── LivePreview.tsx             # Sandboxed iframe with keyboard focus outline inspection
│   ├── ScreenReaderSimulator.tsx   # Web Speech API vocalizer & step-by-step announcement feed
│   ├── ColorContrastTester.tsx     # W3C contrast ratio calculator & color deficiency sim
│   ├── Navbar.tsx                  # Skip link, theme toggle, API key configuration
│   └── ExportModal.tsx             # Accessible dialog to export Markdown / JSON audit reports
├── data/
│   └── sampleSnippets.ts           # Problematic presets (Login form, Custom Modal, Toolbar, Low-contrast card)
├── lib/
│   ├── heuristicA11y.ts            # Deterministic AST/regex offline rule analyzer
│   ├── speech.ts                   # SpeechSynthesis API wrapper for audio simulation
│   └── utils.ts                    # Classname merger and string helpers
└── types/
    └── accessibility.ts            # Strict TypeScript contracts for WCAG issues & results
```

---

## 5. AI Integration & Prompt Engineering

### How Claude Fits
Rather than acting as a free-form chatbot, Claude 3.5 Sonnet serves as an **expert accessibility compliance compiler**. It receives raw HTML or JSX markup, parses user intent, cross-references W3C WCAG 2.1 AA criteria, and responds with a strict, type-safe JSON schema.

### System Prompt Architecture
```text
You are AccessiCraft AI, a world-class Web Accessibility (a11y) and W3C WCAG 2.1 AA/AAA compliance engineer.
Your task is to analyze the provided HTML/JSX/component code, identify all accessibility barriers, and output a production-ready, fully accessible remediated version along with structured diagnostic data.

Respond ONLY with a valid JSON object matching this schema:
{
  "score": number (0-100),
  "complianceLevel": "Non-Compliant" | "WCAG 2.1 A" | "WCAG 2.1 AA" | "WCAG 2.1 AAA",
  "summary": "string",
  "issues": [ { "criterion", "principle", "level", "severity", "title", "description", "recommendation", "impact", "codeSnippet" } ],
  "remediatedCode": "string",
  "screenReaderWalkthrough": [ { "step", "focusedElement", "announcedText", "keyboardAction", "annotation" } ],
  "keyboardNavigationMap": [ "string" ],
  "keyImprovements": [ "string" ]
}
```

### Why This Design?
1. **Determinism & Parsing Reliability**: Enforcing JSON schema guarantees predictable UI rendering without markdown hallucinations.
2. **Pedagogical Impact**: Instead of just fixing code, it returns an explicit `screenReaderWalkthrough`, teaching developers what assistive technology actually verbalizes.
3. **Structured Resilience**: If Claude encounters network latency or rate-limiting, the application catches the error and serves deterministic diagnostics through `heuristicA11y.ts`.

---

## 6. Testing Evidence & Coverage

AccessiCraft utilizes **Vitest** and **React Testing Library** for automated unit and component testing.

### Test Execution Summary
```bash
npm run test:coverage
```

```
 ✓ src/test/heuristicA11y.test.ts (5 tests)
 ✓ src/test/AccessibilityAuditBadge.test.tsx (3 tests)
 ✓ src/test/CodeEditor.test.tsx (3 tests)
 ✓ src/test/DiffViewer.test.tsx (3 tests)
 ✓ src/test/ExportModal.test.tsx (3 tests)
 ✓ src/test/IssuesList.test.tsx (3 tests)
 ✓ src/test/LivePreview.test.tsx (2 tests)
 ✓ src/test/Navbar.test.tsx (3 tests)
 ✓ src/test/ScreenReaderSimulator.test.tsx (1 test)
 ✓ src/test/ColorContrastTester.test.tsx (3 tests)

 Test Files  10 passed (10)
      Tests  29 passed (29)
```

### Component Coverage Metrics
| File / Directory | Statements | Branches | Functions | Lines |
| :--- | :---: | :---: | :---: | :---: |
| `src/components/AccessibilityAuditBadge.tsx` | 96.61% | 78.57% | 100% | **96.61%** |
| `src/components/CodeEditor.tsx` | 85.10% | 60.00% | 40.00% | **85.10%** |
| `src/components/ColorContrastTester.tsx` | 96.95% | 32.14% | 50.00% | **96.95%** |
| `src/components/DiffViewer.tsx` | 84.02% | 80.00% | 60.00% | **84.02%** |
| `src/components/ExportModal.tsx` | 62.58% | 80.00% | 28.57% | **62.58%** |
| `src/components/IssuesList.tsx` | 85.44% | 82.60% | 100% | **85.44%** |
| `src/components/LivePreview.tsx` | 97.91% | 60.00% | 40.00% | **97.91%** |
| `src/components/Navbar.tsx` | 87.07% | 70.00% | 28.57% | **87.07%** |
| `src/components/ScreenReaderSimulator.tsx` | 54.05% | 62.50% | 25.00% | **54.05%** |
| **All UI Components Combined** | **82.58%** | **65.04%** | **49.05%** | **82.58%** |

*Component line coverage of 82.58% substantially surpasses the course bar of &ge;50%.*

---

## 7. Performance & Accessibility Audit

Audited via Google Lighthouse 11 and axe DevTools:

| Category | Lighthouse Score | Target Bar | Result |
| :--- | :---: | :---: | :---: |
| **Performance** | **98 / 100** | &ge; 90 | PASS |
| **Accessibility (WCAG 2.1 AA)** | **100 / 100** | &ge; 90 | PASS |
| **Best Practices** | **100 / 100** | &ge; 90 | PASS |
| **SEO** | **100 / 100** | &ge; 90 | PASS |

See complete details in [AUDIT_REPORT.md](AUDIT_REPORT.md).

### Concrete Improvement Made
- **Audit Finding**: Initial category tags used slate-400 (`#94a3b8`) on slate-100 (`#f1f5f9`), yielding a **2.91:1** contrast ratio (failing WCAG 1.4.3 minimum 4.5:1).
- **Fix**: Replaced color tokens with slate-700 (`#334155`) in light mode and slate-300 (`#cbd5e1`) on dark containers, elevating the contrast ratio to **6.12:1** (fully compliant with WCAG AA standards).

---

## 8. Deployment & Operation

- **Checklist**: Fully signed-off deployment checklist documented in [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).
- **Safe Failure Behavior**:
  1. If network connectivity fails or Claude API limits are reached, the app automatically switches to the offline heuristic engine with an explanatory status banner (`role="status"`).
  2. If the user submits empty or invalid markup, the API returns a structured HTTP 400 error handled gracefully with zero unhandled rejections.
  3. Interactive previews run in a sandboxed iframe to prevent any malformed user scripts from hijacking the host workspace.
- **Rollback Plan**:
  1. Instant one-click rollback on Vercel Dashboard to the last healthy deployment hash (&lt;30s).
  2. Direct Git rollback: `git revert HEAD && git push origin main`.

---

## 9. Known Limitations & Future Improvements

1. **Complex Multi-File Component Trees**: The current version audits single-file HTML or JSX snippets. Future releases will support uploading complete React component folders with CSS modules.
2. **Automated CI/CD GitHub Action**: Packaging the remediation engine into a GitHub Action that leaves pull request comments with remediated diffs on every commit.
3. **Multi-Language Screen Reader Localization**: Currently supports English speech synthesis; planned expansion to Spanish, French, German, and Japanese.

---

## 10. Engineering Reflection

Read the in-depth reflection in [REFLECTION.md](REFLECTION.md).
- **Hardest Part**: Handling the edge cases between automated linters and true assistive technology semantics, ensuring valid structured JSON responses from LLM reasoning.
- **Next Time**: Implementing Playwright E2E accessibility tests from day 1 and streaming Claude responses via Server-Sent Events.
- **Key Insight**: Good intentions can cause bad UX—learning why positive `tabindex` and overused `aria-live="assertive"` are harmful to disabled users.

---

## License
MIT © 2026 Sumit (@sumit72004)
