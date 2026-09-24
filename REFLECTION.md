# Engineering Reflection: Building & Shipping AccessiCraft AI

**Author**: Sumit (@sumit72004)  
**Project**: AccessiCraft AI (Production Capstone)  
**Date**: September 25, 2026  

---

## 1. What Was Hardest? Why?

The hardest challenge was **bridging the semantic gap between automated linting and real assistive technology ergonomics**. 

Traditional linters (like `eslint-plugin-jsx-a11y` or static AST parsers) catch elementary mechanical errors—such as missing `alt` attributes on images or missing `htmlFor` tags on labels. However, making an application truly accessible requires understanding contextual semantics and operational dynamics:
- How does a modal dialog manage focus trapping when opened, and where does focus return when dismissed with `Escape`?
- How does an icon-only button communicate its intent when an SVG lacks accessible text?
- In what exact order will NVDA or VoiceOver announce a form with live validation errors?

Designing the prompt engineering pipeline for Claude 3.5 Sonnet to output rigorous, valid JSON conforming to our strict `AccessibilityResult` TypeScript schema was demanding. The model occasionally wrapped responses in conversational prose or emitted unescaped quotes inside code blocks. To make the integration production-ready and resilient (FE-07), I had to build a dual-layer sanitization pipeline:
1. Strict schema guidance and few-shot formatting in the system prompt.
2. A deterministic heuristic fallback engine (`heuristicA11y.ts`) that runs client-side or server-side when an API key is missing or quota is depleted.

Balancing deep contextual AI reasoning with zero-latency deterministic fallbacks required thoughtful architectural trade-offs.

---

## 2. What Would I Do Differently Next Time?

If I were to start this project again from scratch, I would **incorporate automated end-to-end accessibility testing via Playwright and `@axe-core/playwright` into the CI/CD pipeline from Day 1**.

While Vitest and React Testing Library allowed us to verify unit state transitions, keyboard shortcuts, and component rendering with over 82% line coverage, testing live keyboard focus navigation inside sandboxed iframes required manual browser verification. Incorporating Playwright E2E tests would allow programmatic verification of real keyboard Tab cycles and automated Axe assertion assertions across all viewport breakpoints in continuous integration before any code merges into `main`.

Additionally, I would implement streaming server-sent events (SSE) for Claude's analysis. While batch JSON generation is clean and predictable, streaming the remediation steps sequentially would reduce perceived latency for long code snippets.

---

## 3. One Thing I Learned That Surprised Me

The most surprising discovery was **how counterproductive well-intentioned accessibility hacks can actually be when implemented incorrectly**.

Before taking FE-10 and building AccessiCraft, I assumed adding `tabindex="1"` or `tabindex="2"` was a helpful way to ensure important elements get focused first. In reality, positive `tabindex` values are an anti-pattern: they disrupt the browser's natural DOM sequence, confuse screen reader users who expect linear reading order, and create jarring focus jumps. 

Similarly, many developers add `aria-live="assertive"` to validation messages, believing it is the safest approach. In practice, `assertive` interrupts whatever the screen reader is currently saying, often cutting off critical instructions before the user can absorb them. Learning to use `aria-live="polite"` with `aria-atomic="true"` taught me that accessibility isn't about being loud—it's about being harmonious with assistive technology conventions.

Shipping AccessiCraft AI transformed accessibility from an abstract checklist into an intuitive engineering discipline.
