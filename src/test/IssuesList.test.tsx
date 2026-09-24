import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IssuesList } from "../components/IssuesList";
import { WCAGIssue } from "../types/accessibility";

const mockIssues: WCAGIssue[] = [
  {
    id: "issue-1",
    criterion: "1.3.1 Info and Relationships",
    principle: "Perceivable",
    level: "A",
    severity: "critical",
    title: "Missing Input Labels",
    description: "Inputs lack labels.",
    recommendation: "Add <label> tags with htmlFor attribute.",
    impact: "Screen reader users cannot read inputs."
  },
  {
    id: "issue-2",
    criterion: "2.4.3 Focus Order",
    principle: "Operable",
    level: "A",
    severity: "serious",
    title: "Positive Tabindex",
    description: "Tabindex > 0 used.",
    recommendation: "Change to tabindex 0.",
    impact: "Disrupts natural tab navigation."
  }
];

describe("IssuesList Component", () => {
  it("renders all issues initially", () => {
    render(<IssuesList issues={mockIssues} />);

    expect(screen.getByText("Accessibility Violations (2)")).toBeInTheDocument();
    expect(screen.getByText("Missing Input Labels")).toBeInTheDocument();
    expect(screen.getByText("Positive Tabindex")).toBeInTheDocument();
  });

  it("filters issues when principle tab is clicked", () => {
    render(<IssuesList issues={mockIssues} />);

    const operableTab = screen.getByRole("tab", { name: "Operable" });
    fireEvent.click(operableTab);

    expect(screen.queryByText("Missing Input Labels")).not.toBeInTheDocument();
    expect(screen.getByText("Positive Tabindex")).toBeInTheDocument();
  });

  it("toggles issue description when clicked", () => {
    render(<IssuesList issues={mockIssues} />);

    const secondIssueBtn = screen.getByRole("button", { name: /Positive Tabindex/i });
    fireEvent.click(secondIssueBtn);

    expect(screen.getByText("Change to tabindex 0.")).toBeInTheDocument();
  });
});
