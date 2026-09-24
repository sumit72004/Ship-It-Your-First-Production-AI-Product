import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LivePreview } from "../components/LivePreview";

describe("LivePreview Component", () => {
  it("renders live sandbox heading and iframe preview", () => {
    render(
      <LivePreview
        remediatedCode="<button>Remediated</button>"
        originalCode="<div>Original</div>"
      />
    );

    expect(screen.getByText(/Live Accessible Sandbox/i)).toBeInTheDocument();
    expect(screen.getByTitle("Interactive Component Preview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remediated Preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Original Preview" })).toBeInTheDocument();
  });

  it("toggles focus rings helper when button is clicked", () => {
    render(
      <LivePreview
        remediatedCode="<button>Remediated</button>"
        originalCode="<div>Original</div>"
      />
    );

    const toggleBtn = screen.getByLabelText(/Toggle visible keyboard focus outline helper/i);
    expect(toggleBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-pressed", "false");
  });
});
