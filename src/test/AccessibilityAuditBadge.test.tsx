import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessibilityAuditBadge } from "../components/AccessibilityAuditBadge";

describe("AccessibilityAuditBadge Component", () => {
  it("renders score and compliance level correctly", () => {
    render(
      <AccessibilityAuditBadge
        score={88}
        level="WCAG 2.1 AA"
        issuesCount={2}
      />
    );

    expect(screen.getByText("88")).toBeInTheDocument();
    expect(screen.getByText("WCAG 2.1 AA")).toBeInTheDocument();
    expect(screen.getByText("2 WCAG accessibility violations identified")).toBeInTheDocument();
  });

  it("renders zero issues state properly", () => {
    render(
      <AccessibilityAuditBadge
        score={98}
        level="WCAG 2.1 AAA"
        issuesCount={0}
      />
    );

    expect(screen.getByText("98")).toBeInTheDocument();
    expect(screen.getByText("WCAG 2.1 AAA")).toBeInTheDocument();
    expect(screen.getByText("All WCAG 2.1 AA success criteria satisfied")).toBeInTheDocument();
  });

  it("contains accessible landmarks and aria labels", () => {
    render(
      <AccessibilityAuditBadge
        score={65}
        level="WCAG 2.1 A"
        issuesCount={4}
      />
    );

    const region = screen.getByRole("region", { name: /Accessibility Compliance Scorecard/i });
    expect(region).toBeInTheDocument();
  });
});
