import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ColorContrastTester } from "../components/ColorContrastTester";

describe("ColorContrastTester Component", () => {
  it("renders contrast ratio calculations and pass/fail indicators", () => {
    render(<ColorContrastTester />);

    expect(screen.getByText(/WCAG Color Contrast & Vision Simulation/i)).toBeInTheDocument();
    expect(screen.getByText(/Contrast Ratio/i)).toBeInTheDocument();
    expect(screen.getByText("Normal Text (Body)")).toBeInTheDocument();
  });

  it("updates contrast when presets are clicked", () => {
    render(<ColorContrastTester />);

    const presetBtn = screen.getByRole("button", { name: /Slate on White/i });
    fireEvent.click(presetBtn);

    // Slate on white produces high contrast ratio - matches multiple pass badges
    const passBadges = screen.getAllByText(/AA PASS/i);
    expect(passBadges.length).toBeGreaterThan(0);
  });

  it("allows switching vision simulation modes", () => {
    render(<ColorContrastTester />);

    const select = screen.getByLabelText(/Vision Sim:/i);
    fireEvent.change(select, { target: { value: "protanopia" } });

    expect((select as HTMLSelectElement).value).toBe("protanopia");
  });
});
