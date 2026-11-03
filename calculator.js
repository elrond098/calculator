function formatResult(value) {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid result");
  }

  return String(value);
}

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

export {
  formatResult,
  evaluateExpression
};
