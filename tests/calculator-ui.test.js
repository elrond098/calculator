/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const pageMarkup = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

async function loadCalculator(initialTheme = null) {
  document.open();
  document.write(pageMarkup);
  document.close();
  localStorage.clear();
  if (initialTheme !== null) localStorage.setItem("calculator-theme", initialTheme);
  vi.resetModules();
  await import("../script.js");
}

function press(...values) {
  for (const value of values) {
    const button = [...document.querySelectorAll(".calculator-button")]
      .find((candidate) => candidate.value === value);
    if (!button) throw new Error(`Missing calculator button: ${value}`);
    button.click();
  }
}

const result = () => document.getElementById("display-result").textContent;
const history = () => document.getElementById("display-expression").textContent;

beforeEach(async () => {
  await loadCalculator();
});

describe("Calculator UI interactions", () => {
  it("renders one button for every supported calculator input", () => {
    const values = [...document.querySelectorAll(".calculator-button")]
      .map((button) => button.value)
      .sort();
    const expected = ["%", "*", "+", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "=", "clear", "delete"]
      .sort();

    expect(values).toEqual(expected);
    expect(new Set([...document.querySelectorAll(".calculator-button")].map((button) => button.id)).size)
      .toBe(expected.length);
  });

  it("calculates with operator precedence and shows the expression history", () => {
    press("2", "+", "3", "*", "4", "=");
    expect(result()).toBe("14");
    expect(history()).toBe("2+3*4");
  });

  it.each([
    [["2", "+", "3", "="], "5", "2+3"],
    [["5", "-", "8", "="], "-3", "5-8"],
    [["3", "*", "4", "="], "12", "3*4"],
    [["8", "/", "2", "="], "4", "8/2"],
    [["1", "0", "%", "3", "="], "1", "10%3"],
  ])("routes operator button sequence %j correctly", (sequence, expected, expectedHistory) => {
    press(...sequence);
    expect(result()).toBe(expected);
    expect(history()).toBe(expectedHistory);
  });

  it("continues from a result when an operator is pressed", () => {
    press("2", "+", "3", "=", "+", "4", "=");
    expect(result()).toBe("9");
    expect(history()).toBe("5+4");
  });

  it("keeps the result stable when equals is pressed again", () => {
    press("2", "+", "3", "=", "=");
    expect(result()).toBe("5");
    expect(history()).toBe("2+3");
  });

  it("starts a fresh expression when a digit follows a result", () => {
    press("2", "+", "3", "=", "7");
    expect(result()).toBe("7");
    expect(history()).toBe("2+3");
  });

  it("supports negative operands after a multiplication operator", () => {
    press("5", "*", "-", "2", "=");
    expect(result()).toBe("-10");
    expect(history()).toBe("5*-2");
  });

  it("allows a leading minus and ignores other leading operators", () => {
    press("+", "-", "5", "=");
    expect(result()).toBe("-5");
    expect(history()).toBe("-5");
  });

  it("replaces a trailing operator when another operator is entered", () => {
    press("5", "+", "*", "2", "=");
    expect(result()).toBe("10");
    expect(history()).toBe("5*2");
  });

  it("adds a leading zero and prevents duplicate decimal points", () => {
    press(".", "5", ".", "+", ".", "5", "=");
    expect(result()).toBe("1");
    expect(history()).toBe("0.5+0.5");
  });

  it("supports a negative decimal beginning with a decimal point", () => {
    press("-", ".", "5", "=");
    expect(result()).toBe("-0.5");
    expect(history()).toBe("-0.5");
  });

  it("inserts a zero before a decimal point after an operator", () => {
    press("5", "+", ".", "5", "=");
    expect(result()).toBe("5.5");
    expect(history()).toBe("5+0.5");
  });

  it("ignores an operator immediately after a decimal point", () => {
    press("5", ".", "+", "2", "=");
    expect(result()).toBe("5.2");
    expect(history()).toBe("5.2");
  });

  it("does not replace an operator while a unary minus follows it", () => {
    press("5", "*", "-", "*", "2", "=");
    expect(result()).toBe("-10");
    expect(history()).toBe("5*-2");
  });

  it("deletes one character and can then calculate the edited expression", () => {
    press("1", "2", "3", "delete", "=");
    expect(result()).toBe("12");
    expect(history()).toBe("12");
  });

  it("shows zero after deleting the only entered digit", () => {
    press("7", "delete");
    expect(result()).toBe("0");
    expect(history()).toBe("");
  });

  it("deletes a trailing operator before calculating", () => {
    press("1", "2", "+", "delete", "=");
    expect(result()).toBe("12");
    expect(history()).toBe("12");
  });

  it("allows editing a displayed result after delete", () => {
    press("2", "+", "3", "4", "=", "delete", "=");
    expect(result()).toBe("3");
    expect(history()).toBe("3");
  });

  it("clears the current expression, result, and expression history", () => {
    press("8", "+", "2", "=");
    press("clear");
    expect(result()).toBe("0");
    expect(history()).toBe("");
  });

  it("recovers from an error after clear", () => {
    press("1", "/", "0", "=");
    expect(result()).toBe("Error");
    press("clear", "7", "+", "1", "=");
    expect(result()).toBe("8");
    expect(history()).toBe("7+1");
  });

  it.each([
    [["1", "/", "0", "="], "division"],
    [["1", "%", "0", "="], "modulus"],
  ])("shows an error for %s by zero", (sequence) => {
    press(...sequence);
    expect(result()).toBe("Error");
  });

  it("ignores equals for an empty or incomplete expression", () => {
    press("=");
    expect(result()).toBe("0");
    press("4", "+", "=");
    expect(result()).toBe("4+");
    expect(history()).toBe("");
  });

  it("ignores equals while the expression ends with a decimal point", () => {
    press("5", ".", "=");
    expect(result()).toBe("5.");
    expect(history()).toBe("");
  });

  it("ignores clicks on non-button content and unsupported button values", () => {
    document.getElementById("calculator-display").click();
    const unsupportedButton = document.createElement("button");
    unsupportedButton.className = "calculator-button";
    unsupportedButton.value = "x";
    document.getElementById("calculator").append(unsupportedButton);
    unsupportedButton.click();
    expect(result()).toBe("0");
  });

  it("handles a click on nested content inside a calculator button", () => {
    const button = document.querySelector('.calculator-button[value="7"]');
    const nestedContent = document.createElement("span");
    nestedContent.textContent = "7";
    button.replaceChildren(nestedContent);
    nestedContent.click();
    expect(result()).toBe("7");
  });
});

describe("Theme toggle", () => {
  it("starts in light mode by default", () => {
    expect(document.body.classList.contains("dark-mode")).toBe(false);
    expect(document.getElementById("theme-toggle").getAttribute("aria-pressed")).toBe("false");
    expect(document.getElementById("theme-icon").textContent).toBe("☾");
  });

  it("restores a saved dark theme", async () => {
    await loadCalculator("dark");
    expect(document.body.classList.contains("dark-mode")).toBe(true);
    expect(document.getElementById("theme-toggle").getAttribute("aria-pressed")).toBe("true");
  });

  it("falls back to light mode for an unrecognized saved theme", async () => {
    await loadCalculator("sepia");
    expect(document.body.classList.contains("dark-mode")).toBe(false);
    expect(document.getElementById("theme-toggle").getAttribute("aria-pressed")).toBe("false");
  });

  it("falls back to light mode if reading the saved theme fails", async () => {
    document.open();
    document.write(pageMarkup);
    document.close();
    localStorage.clear();
    vi.resetModules();
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    try {
      await import("../script.js");
      expect(document.body.classList.contains("dark-mode")).toBe(false);
      expect(document.getElementById("theme-toggle").getAttribute("aria-pressed")).toBe("false");
    } finally {
      getItem.mockRestore();
    }
  });

  it("toggles the theme and persists the new setting", () => {
    document.getElementById("theme-toggle").click();
    expect(document.body.classList.contains("dark-mode")).toBe(true);
    expect(localStorage.getItem("calculator-theme")).toBe("dark");
    expect(document.getElementById("theme-toggle").getAttribute("aria-label")).toBe("Switch to light mode");

    document.getElementById("theme-toggle").click();
    expect(document.body.classList.contains("dark-mode")).toBe(false);
    expect(localStorage.getItem("calculator-theme")).toBe("light");
  });

  it("keeps the theme icon and accessible label in sync", () => {
    const toggle = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");

    expect(toggle.getAttribute("aria-label")).toBe("Switch to dark mode");
    expect(icon.textContent).toBe("☾");
    toggle.click();
    expect(toggle.getAttribute("aria-label")).toBe("Switch to light mode");
    expect(icon.textContent).toBe("☀");
  });

  it("does not treat the theme toggle as a calculator input", () => {
    document.getElementById("theme-toggle").click();
    expect(result()).toBe("0");
    expect(history()).toBe("");
    expect(document.body.classList.contains("dark-mode")).toBe(true);
  });

  it("keeps theme switching functional when storage writes fail", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    try {
      document.getElementById("theme-toggle").click();
      expect(document.body.classList.contains("dark-mode")).toBe(true);
      expect(document.getElementById("theme-toggle").getAttribute("aria-pressed")).toBe("true");
    } finally {
      setItem.mockRestore();
    }
  });
});
