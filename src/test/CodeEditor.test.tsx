import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CodeEditor } from "../components/CodeEditor";

describe("CodeEditor Component", () => {
  it("renders editor textarea, character count, and audit button", () => {
    render(
      <CodeEditor
        code="<button>Click</button>"
        onChange={vi.fn()}
        onAudit={vi.fn()}
        loading={false}
        onSelectPreset={vi.fn()}
        selectedPresetId="unlabelled-form"
      />
    );

    expect(screen.getByText("Input Component or HTML Snippet")).toBeInTheDocument();
    expect(screen.getByText(/characters/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Audit and Remediate with AI/i })).toBeInTheDocument();
  });

  it("calls onAudit when button is clicked", () => {
    const handleAudit = vi.fn();
    render(
      <CodeEditor
        code="<button>Click</button>"
        onChange={vi.fn()}
        onAudit={handleAudit}
        loading={false}
        onSelectPreset={vi.fn()}
        selectedPresetId="unlabelled-form"
      />
    );

    const auditBtn = screen.getByRole("button", { name: /Audit and Remediate with AI/i });
    fireEvent.click(auditBtn);

    expect(handleAudit).toHaveBeenCalledTimes(1);
  });

  it("calls onSelectPreset when a preset is chosen", () => {
    const handleSelectPreset = vi.fn();
    render(
      <CodeEditor
        code="<button>Click</button>"
        onChange={vi.fn()}
        onAudit={vi.fn()}
        loading={false}
        onSelectPreset={handleSelectPreset}
        selectedPresetId="unlabelled-form"
      />
    );

    const select = screen.getByLabelText(/Preset:/i);
    fireEvent.change(select, { target: { value: "inaccessible-modal" } });

    expect(handleSelectPreset).toHaveBeenCalledWith("inaccessible-modal");
  });
});
