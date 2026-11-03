
"use strict";

// Theme elements
const themeToggleButton = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Calculator elements
const calculator = document.getElementById("calculator");
const expressionHistoryDisplay = document.getElementById("display-expression");
const mainDisplay = document.getElementById("display-result");
const scroolDisplay = document.querySelectorAll(".display-expression, .display-result");

// Calculator state
let previousExpression = "";
let displayValue = "";
let currentExpression = "";
let isResultDisplayed = false;

// Calculator constants
const OPERATORS = ["+", "-", "*", "/", "%"];
const OPERATOR_PATTERN = /[+\-*/%]$/;

// Display helpers
function updateExpressionHistoryDisplay(value = previousExpression) {
  expressionHistoryDisplay.textContent = value || "";
  scrollDisplayToRight();
}

function updateMainDisplay(value = displayValue) {
  mainDisplay.textContent = value || "0";
  scrollDisplayToRight();
}

// Reset calculator
function clearCalculator() {
  previousExpression = "";
  displayValue = "";
  currentExpression = "";
  isResultDisplayed = false;

  updateExpressionHistoryDisplay();
  updateMainDisplay();
}

// Delete the last character from the current result/expression
function deleteLastCharacter() {
  if (isResultDisplayed) {
    // Allow editing the displayed answer after calculation
    currentExpression = displayValue;
    isResultDisplayed = false;
  }

  currentExpression = currentExpression.slice(0, -1);
  displayValue = currentExpression;

  updateMainDisplay();
}

// Handle calculator button clicks
calculator.addEventListener("click", (event) => {
  const button = event.target.closest(".calculator-button");

  if (!button || !calculator.contains(button)) return;

  const value = button.value;

  if (value === "clear") {
    clearCalculator();
    return;
  }

  if (value === "delete") {
    deleteLastCharacter();
    return;
  }

  if (value === "=") {
    calculateResult();
    return;
  }

  if (!/^(?:\d|[.+\-*/%])$/.test(value)) return;

  enterValue(value);
});

// Enter numbers, decimals, and operators
function enterValue(value) {
  const isOperator = OPERATORS.includes(value);

  if (isResultDisplayed) {
    if (isOperator) {
      // Continue calculation using the previous result
      currentExpression = displayValue + value;
    } else {
      // Start a new calculation
      currentExpression = value === "." ? "0." : value;
    }

    isResultDisplayed = false;
    displayValue = currentExpression;
    updateMainDisplay();
    return;
  }

  // Allow minus at the beginning for negative numbers
  if (isOperator && currentExpression === "") {
    if (value !== "-") return;
  }

  // Handle consecutive operators
  if (isOperator && OPERATOR_PATTERN.test(currentExpression)) {
    const lastOperator = currentExpression.slice(-1);
    const previousOperator = currentExpression.slice(-2, -1);

    // Allow negative numbers after operators, e.g. 5*-2
    if (value === "-" && lastOperator !== "-") {
      currentExpression += value;
      displayValue = currentExpression;
      updateMainDisplay();
      return;
    }

    // Replace the previous operator
    if (OPERATORS.includes(previousOperator)) {
      return;
    } else {
      currentExpression = currentExpression.slice(0, -1);
    }

    if (!currentExpression && value !== "-") return;
  }

  if (currentExpression.slice(-1) === "." && isOperator) {
    return;
  }
  // Prevent multiple decimal points in the same number
  if (value === ".") {
    const currentNumber = currentExpression.split(/[+\-*/%]/).pop();

    if (currentNumber.includes(".")) return;

    if (!currentNumber) {
      currentExpression += "0";
    }
  }

  currentExpression += value;
  displayValue = currentExpression;

  updateMainDisplay();
}

// Calculate and display the result
function calculateResult() {
  if (
    !currentExpression ||
      OPERATOR_PATTERN.test(currentExpression) ||
      currentExpression.endsWith(".")
  ) {
    return;
  }

  try {
    const calculatedValue = evaluateExpression(currentExpression);
    const formattedResult = formatResult(calculatedValue);

    // Save the completed expression in history
    previousExpression = currentExpression;
    updateExpressionHistoryDisplay();

    // Show the answer in the main display
    displayValue = formattedResult;
    isResultDisplayed = true;

    updateMainDisplay();
  } catch {
    displayValue = "Error";
    isResultDisplayed = true;

    updateMainDisplay();
  }
}

// Format floating-point results
function formatResult(value) {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid result");
  }

  return String(value);
}

// Validate and evaluate a mathematical expression
function evaluateExpression(input) {
  if (!/^[0-9eE+\-*/%.]+$/.test(input)) {
    throw new Error("Invalid expression");
  }

  const tokens = input.match(
    /(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[+\-*/%]/gi
  );

  if (!tokens || tokens.join("") !== input) {
    throw new Error("Invalid expression");
  }

  let position = 0;

  function parseNumber() {
    const token = tokens[position++];

    // Handle unary plus and minus
    if (token === "+" || token === "-") {
      const number = parseNumber();
      return token === "-" ? -number : number;
    }

    const number = Number(token);

    if (!Number.isFinite(number)) {
      throw new Error("Invalid number");
    }

    return number;
  }

  // Multiplication, division, and remainder
  function parseTerm() {
    let value = parseNumber();

    while (["*", "/", "%"].includes(tokens[position])) {
      const operator = tokens[position++];
      const nextNumber = parseNumber();

      if (
        (operator === "/" || operator === "%") &&
          nextNumber === 0
      ) {
        throw new Error("Division by zero");
      }

      switch (operator) {
        case "*":
          value *= nextNumber;
          break;
        case "/":
          value /= nextNumber;
          break;
        case "%":
          value %= nextNumber;
          break;
      }

      if (!Number.isFinite(value)) {
        throw new Error("Invalid result");
      }
    }

    return value;
  }

  // Addition and subtraction
  function parseSum() {
    let value = parseTerm();

    while (
      tokens[position] === "+" ||
        tokens[position] === "-"
    ) {
      const operator = tokens[position++];
      const nextNumber = parseTerm();

      value = operator === "+"
        ? value + nextNumber
        : value - nextNumber;

      if (!Number.isFinite(value)) {
        throw new Error("Invalid result");
      }
    }

    return value;
  }

  const result = parseSum();

  if (position !== tokens.length) {
    throw new Error("Invalid expression");
  }

  return result;
}
function scrollDisplayToRight() {
  scroolDisplay.forEach(display => {
    display.scrollLeft = display.scrollWidth;
  });
}

// Theme management
function setTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark-mode", isDark);

  themeToggleButton.setAttribute("aria-pressed", String(isDark));
  themeToggleButton.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );

  themeIcon.textContent = isDark ? "☀" : "☾";

  try {
    localStorage.setItem("calculator-theme", theme);
  } catch {
    // Continue working if storage is unavailable
  }
}

// Initialize saved theme
let savedTheme = "light";

try {
  savedTheme = localStorage.getItem("calculator-theme") || "light";
} catch {
  // Use light theme if storage is unavailable
}

setTheme(savedTheme === "dark" ? "dark" : "light");

// Toggle theme
themeToggleButton.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-mode");

  setTheme(isDark ? "light" : "dark");
});

export {
  formatResult,
  evaluateExpression
};
