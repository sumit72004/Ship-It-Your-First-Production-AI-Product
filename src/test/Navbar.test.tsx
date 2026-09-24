import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "../components/Navbar";

describe("Navbar Component", () => {
  it("renders brand, skip link, and navigation controls", () => {
    render(
      <Navbar
        apiKey=""
        onApiKeyChange={vi.fn()}
        isDark={true}
        onToggleTheme={vi.fn()}
      />
    );

    expect(screen.getByText("AccessiCraft")).toBeInTheDocument();
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
    expect(screen.getByLabelText(/Configure Anthropic Claude API Key/i)).toBeInTheDocument();
  });

  it("calls onToggleTheme when theme button is clicked", () => {
    const handleToggle = vi.fn();
    render(
      <Navbar
        apiKey=""
        onApiKeyChange={vi.fn()}
        isDark={true}
        onToggleTheme={handleToggle}
      />
    );

    const themeBtn = screen.getByLabelText(/Switch to high-contrast light mode/i);
    fireEvent.click(themeBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("opens API key configuration dialog when clicked", () => {
    render(
      <Navbar
        apiKey=""
        onApiKeyChange={vi.fn()}
        isDark={false}
        onToggleTheme={vi.fn()}
      />
    );

    const keyBtn = screen.getByLabelText(/Configure Anthropic Claude API Key/i);
    fireEvent.click(keyBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText(/API Key \(sk-ant-\.\.\.\)/i)).toBeInTheDocument();
  });
});
