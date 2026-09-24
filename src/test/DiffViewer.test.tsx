import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { DiffViewer } from "../components/DiffViewer";

describe("DiffViewer Component", () => {
  const originalCode = "<input placeholder='Search' />";
  const remediatedCode = "<label for='search'>Search</label><input id='search' />";
  const keyImprovements = ["Added explicit label", "Added focus ring"];

  it("renders remediated code and key improvements by default", () => {
    render(
      <DiffViewer
        originalCode={originalCode}
        remediatedCode={remediatedCode}
        keyImprovements={keyImprovements}
      />
    );

    expect(screen.getByText("Remediated Production Code")).toBeInTheDocument();
    expect(screen.getByText("Added explicit label")).toBeInTheDocument();
    expect(screen.getByText(remediatedCode)).toBeInTheDocument();
  });

  it("switches view mode when buttons are clicked", () => {
    render(
      <DiffViewer
        originalCode={originalCode}
        remediatedCode={remediatedCode}
        keyImprovements={keyImprovements}
      />
    );

    const originalBtn = screen.getByRole("button", { name: "Original" });
    fireEvent.click(originalBtn);

    expect(screen.getByText(originalCode)).toBeInTheDocument();
  });

  it("copies code to clipboard when Copy Code button is clicked", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(
      <DiffViewer
        originalCode={originalCode}
        remediatedCode={remediatedCode}
        keyImprovements={keyImprovements}
      />
    );

    const copyBtn = screen.getByRole("button", { name: /Copy remediated code/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(remediatedCode);
  });
});
