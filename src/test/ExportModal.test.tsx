import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExportModal } from "../components/ExportModal";
import { AccessibilityResult } from "../types/accessibility";

const mockResult: AccessibilityResult = {
  score: 92,
  complianceLevel: "WCAG 2.1 AA",
  summary: "Great job, only 1 issue left.",
  issues: [],
  remediatedCode: "<button>Valid</button>",
  screenReaderWalkthrough: [],
  keyboardNavigationMap: [],
  keyImprovements: ["Added button type"],
  timestamp: new Date().toISOString(),
  engine: "Smart Fallback Engine (Offline/Edge)"
};

describe("ExportModal Component", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ExportModal
        isOpen={false}
        onClose={vi.fn()}
        result={mockResult}
        inputCode="<div>test</div>"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders modal dialog when isOpen is true", () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={vi.fn()}
        result={mockResult}
        inputCode="<div>test</div>"
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Export Compliance Audit Report")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Markdown" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "JSON" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <ExportModal
        isOpen={true}
        onClose={handleClose}
        result={mockResult}
        inputCode="<div>test</div>"
      />
    );

    const closeBtn = screen.getByLabelText(/Close export dialog/i);
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
