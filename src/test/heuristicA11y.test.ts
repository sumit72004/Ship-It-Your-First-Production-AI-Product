import { describe, it, expect } from "vitest";
import { analyzeAccessibilityHeuristics } from "../lib/heuristicA11y";

describe("Heuristic Accessibility Analyzer", () => {
  it("detects unlabelled input fields and flags WCAG 1.3.1", () => {
    const code = `<form><input type="text" placeholder="Username" /></form>`;
    const result = analyzeAccessibilityHeuristics(code);

    const issue = result.issues.find(i => i.id === "wcag-1-3-1-form-labels");
    expect(issue).toBeDefined();
    expect(issue?.principle).toBe("Perceivable");
    expect(issue?.severity).toBe("critical");
    expect(result.score).toBeLessThan(100);
  });

  it("detects non-semantic interactive click elements and flags WCAG 4.1.2", () => {
    const code = `<div onclick="submitData()">Submit Now</div>`;
    const result = analyzeAccessibilityHeuristics(code);

    const issue = result.issues.find(i => i.id === "wcag-4-1-2-semantic-buttons");
    expect(issue).toBeDefined();
    expect(issue?.principle).toBe("Robust");
    expect(issue?.severity).toBe("critical");
  });

  it("detects positive tabindex anti-pattern and flags WCAG 2.4.3", () => {
    const code = `<button tabindex="4">Click me</button>`;
    const result = analyzeAccessibilityHeuristics(code);

    const issue = result.issues.find(i => i.id === "wcag-2-4-3-positive-tabindex");
    expect(issue).toBeDefined();
    expect(issue?.principle).toBe("Operable");
  });

  it("detects missing or empty image alt attributes and flags WCAG 1.1.1", () => {
    const code = `<img src="hero-graphic.png" />`;
    const result = analyzeAccessibilityHeuristics(code);

    const issue = result.issues.find(i => i.id === "wcag-1-1-1-non-text-content");
    expect(issue).toBeDefined();
    expect(issue?.principle).toBe("Perceivable");
  });

  it("produces remediated code with labels, buttons, and screen reader steps", () => {
    const code = `
      <form>
        <div class="header">Login</div>
        <input type="email" placeholder="Email" />
        <button class="submit-btn"><svg></svg></button>
      </form>
    `;
    const result = analyzeAccessibilityHeuristics(code);

    expect(result.remediatedCode).toContain("<label");
    expect(result.remediatedCode).toContain("aria-label");
    expect(result.screenReaderWalkthrough.length).toBeGreaterThan(0);
    expect(result.keyboardNavigationMap.length).toBeGreaterThan(0);
  });
});
