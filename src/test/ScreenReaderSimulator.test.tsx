import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScreenReaderSimulator } from "../components/ScreenReaderSimulator";
import { ScreenReaderStep } from "../types/accessibility";

const mockSteps: ScreenReaderStep[] = [
  {
    step: 1,
    focusedElement: "Submit Form Button",
    announcedText: "Submit Inquiry, button",
    keyboardAction: "Tab key",
    annotation: "Provides clear button role and accessible label."
  }
];

const mockKeyboardMap = [
  "Tab: Focuses Submit Form Button",
  "Enter: Submits form"
];

describe("ScreenReaderSimulator Component", () => {
  it("renders screen reader announcements and keyboard navigation trajectory", () => {
    render(
      <ScreenReaderSimulator
        steps={mockSteps}
        keyboardNavigationMap={mockKeyboardMap}
      />
    );

    expect(screen.getByText(/Screen Reader & Keyboard Simulator/i)).toBeInTheDocument();
    expect(screen.getByText("Submit Form Button")).toBeInTheDocument();
    expect(screen.getByText(/“Submit Inquiry, button”/i)).toBeInTheDocument();
    expect(screen.getByText(/Tab: Focuses Submit Form Button/i)).toBeInTheDocument();
  });
});
