# Structured Portfolio Entry: AccessiCraft AI

**Intern / Engineer**: Sumit (@sumit72004)  
**Capstone**: Build & Deploy a Production-Ready AI-Enhanced Frontend Application  
**Date**: September 25, 2026  

---

## 1. Project Brief
**AccessiCraft AI** is an intelligent web accessibility (a11y) diagnostic and remediation platform that transforms inaccessible HTML, JSX, and UI components into WCAG 2.1 AA-compliant, production-ready code while simulating real-world assistive technology experiences. While automated linters catch only ~30% of surface-level accessibility errors (such as missing image `alt` tags), they fail on semantic context, focus trapping, and screen reader flow. Built for frontend engineers, UI/UX designers, and accessibility auditors, AccessiCraft bridges this gap by combining Claude 3.5 Sonnet's contextual reasoning with an offline-first deterministic heuristic engine, interactive keyboard sandbox, Web Speech API audio narration simulator, and real-time WCAG color contrast analyzer. I chose this idea because true web accessibility is a fundamental civil right for millions of disabled web users, yet developer education and remediation tooling remain fragmented and cumbersome.

---

## 2. Live, Deployed Application
- **Live Production URL**: [https://accessicraft-ai.vercel.app](https://accessicraft-ai.vercel.app)
- **Deployment Platform**: Vercel Serverless Edge Platform
- **Functionality**: 100% functional production web app (not a mockup).
- **Accessibility Benchmark**: WCAG 2.1 AA compliance verified with axe-core and keyboard navigation testing.

---

## 3. Repository with Complete Documentation
- **GitHub Repository**: [https://github.com/sumit72004/Ship-It-Your-First-Production-AI-Product](https://github.com/sumit72004/Ship-It-Your-First-Production-AI-Product)
- **One-Command Setup**: `npm install && npm run dev`
- **Documentation Included**:
  - `README.md` (Architecture, setup, prompt design, limitations)
  - `DEPLOYMENT_CHECKLIST.md` (Signed-off FE-11 checklist)
  - `AUDIT_REPORT.md` (Lighthouse & Axe DevTools reports)
  - `REFLECTION.md` (Full 1-page engineering reflection)

---

## 4. Testing Evidence
- **Testing Framework**: Vitest 2.1 + React Testing Library + @testing-library/jest-dom
- **Test Results**: 10 test suites, **29 tests passing** (100% pass rate).
- **Component Coverage**: **82.58%** line coverage across all frontend components (exceeds &ge;50% requirement).

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

Test Files: 10 passed (10) | Tests: 29 passed (29)
Coverage: 82.58% Component Line Coverage
```

---

## 5. Performance & Accessibility Audit
- **Lighthouse Performance**: **98 / 100** (FCP: 0.8s, LCP: 1.2s, TBT: 10ms, CLS: 0.000)
- **Lighthouse Accessibility**: **100 / 100** (Zero WCAG AA violations)
- **Lighthouse Best Practices**: **100 / 100**
- **Lighthouse SEO**: **100 / 100**
- **Axe DevTools**: 0 Critical, 0 Serious violations.
- **Concrete Improvement Made**: Upgraded category badge color tokens from slate-400 on slate-100 (2.91:1 ratio) to slate-700 / slate-300 (6.12:1 ratio), ensuring full WCAG 1.4.3 compliance for low-vision users.

---

## 6. Deployment & Operation
- **Deployment Checklist**: Complete and signed off in `DEPLOYMENT_CHECKLIST.md`.
- **Resilience & Safe Failure (FE-07)**:
  - If the Claude API key is absent or exhausted, the app triggers an automatic graceful fallback to the local deterministic heuristic engine (`heuristicA11y.ts`) with an informative user notice.
  - Interactive code previews run in an isolated sandbox iframe (`sandbox="allow-scripts"`).
- **Rollback Plan**:
  - Instant Vercel rollback button (&lt; 30 seconds).
  - Git rollback via `git revert HEAD && git push origin main`.

---

## 7. Engineering Reflection
- **What Was Hardest?**: Bridging the gap between static linter checks and true assistive technology semantics, and ensuring the LLM strictly emitted valid, type-safe JSON for edge-case user inputs.
- **What Would I Do Differently?**: Implement automated end-to-end accessibility testing using Playwright and `@axe-core/playwright` in GitHub Actions CI from Day 1, and stream Claude responses via Server-Sent Events.
- **Surprising Insight**: Good intentions often cause poor accessibility—learning that positive `tabindex` values and aggressive `aria-live="assertive"` announcements actually disorient screen reader users rather than helping them.
