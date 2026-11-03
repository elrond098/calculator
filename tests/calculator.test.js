import { describe, it, expect } from "vitest";
import {
  evaluateExpression,
  formatResult,
} from "../calculator.js";


/* =========================================================
   1. BASIC ARITHMETIC OPERATIONS
========================================================= */

describe("Basic Arithmetic Operations", () => {
  it.each([
    ["1+1", 2],
    ["2+3", 5],
    ["10+20", 30],
    ["100+200", 300],

    ["5-2", 3],
    ["10-5", 5],
    ["100-25", 75],
    ["5-10", -5],

    ["2*3", 6],
    ["5*5", 25],
    ["10*10", 100],
    ["12*12", 144],

    ["10/2", 5],
    ["100/10", 10],
    ["81/9", 9],
    ["7/2", 3.5],
  ])("should calculate %s correctly", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   2. OPERATOR PRECEDENCE
========================================================= */

describe("Operator Precedence", () => {
  it.each([
    ["2+3*4", 14],
    ["10+5*2", 20],
    ["100-10*5", 50],
    ["20/2+5", 15],
    ["20-10/2", 15],

    ["2+3*4-5", 9],
    ["10+20/5*2", 18],
    ["100-20*2+10", 70],

    ["2*3+4*5", 26],
    ["100/10+5*2", 20],
    ["50+20/5-3", 51],
  ])("should respect operator precedence in %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   3. LEFT-TO-RIGHT EVALUATION
========================================================= */

describe("Left-to-Right Evaluation", () => {
  it.each([
    ["20-5-3", 12],
    ["100-20-30", 50],
    ["50-10-5-5", 30],

    ["20/5*2", 8],
    ["100/10*2", 20],
    ["60/3/2", 10],

    ["20%6*2", 4],
    ["50%7%3", 1],
    ["100%9%4", 1],
  ])("should evaluate operators from left to right in %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   4. NEGATIVE NUMBERS AND UNARY OPERATORS
========================================================= */

describe("Negative Numbers and Unary Operators", () => {
  it.each([
    ["-5", -5],
    ["-10", -10],
    ["-100", -100],

    ["-5+2", -3],
    ["-5-2", -7],
    ["-5*2", -10],
    ["-10/2", -5],

    ["5+-2", 3],
    ["5--2", 7],
    ["5*-2", -10],
    ["5/-2", -2.5],

    ["-5+10", 5],
    ["-10+5", -5],
    ["-10-5", -15],

    ["-2*-3", 6],
    ["-10/-2", 5],
    ["-10%3", -1],
  ])("should handle negative numbers in %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   5. DECIMAL NUMBERS
========================================================= */

describe("Decimal Numbers", () => {
  it.each([
    ["0.5+0.5", 1],
    ["1.5+2.5", 4],
    ["10.25+5.75", 16],

    ["5.5-2.5", 3],
    ["10.75-0.75", 10],

    ["1.5*2", 3],
    ["2.5*4", 10],
    ["0.5*0.5", 0.25],

    ["5.5/2", 2.75],
    ["10/4", 2.5],
    ["1/4", 0.25],

    [".5+.5", 1],
    [".25*4", 1],
    ["5.", 5],
    ["5.+2", 7],
  ])("should calculate decimal expression %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   6. FLOATING-POINT PRECISION
========================================================= */

describe("Floating-Point Precision", () => {
  it("should preserve JavaScript floating-point result for 0.1+0.2", () => {
    expect(evaluateExpression("0.1+0.2")).toBe(0.30000000000000004);
  });

  it("should preserve JavaScript floating-point result for 0.3-0.1", () => {
    expect(evaluateExpression("0.3-0.1")).toBe(0.19999999999999998);
  });

  it("should calculate 0.1*0.2", () => {
    expect(evaluateExpression("0.1*0.2")).toBe(0.020000000000000004);
  });

  it("should calculate 1/10", () => {
    expect(evaluateExpression("1/10")).toBe(0.1);
  });
});


/* =========================================================
   7. SCIENTIFIC NOTATION
========================================================= */

describe("Scientific Notation", () => {
  it.each([
    ["1e2", 100],
    ["1e3", 1000],
    ["2e2", 200],
    ["5e1", 50],

    ["1e-1", 0.1],
    ["1e-2", 0.01],
    ["1e-3", 0.001],

    ["2e2+100", 300],
    ["1e3-500", 500],
    ["2e2*2", 400],
    ["1e2/2", 50],

    ["1E2", 100],
    ["1E-2", 0.01],
  ])("should evaluate scientific notation %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   8. MODULUS OPERATIONS
========================================================= */

describe("Modulus Operations", () => {
  it.each([
    ["10%3", 1],
    ["20%6", 2],
    ["50%7", 1],
    ["100%9", 1],
    ["25%5", 0],

    ["10.5%2", 0.5],
    ["5.5%2", 1.5],

    ["-10%3", -1],
    ["10%-3", 1],
    ["-10%-3", -1],

    ["10%3+5", 6],
    ["10+10%3", 11],
    ["20%6*2", 4],
  ])("should calculate modulus expression %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   9. LARGE AND SMALL NUMBERS
========================================================= */

describe("Large and Small Numbers", () => {
  it.each([
    ["1000000+1", 1000001],
    ["1000000000+1", 1000000001],
    ["1000000*1000000", 1000000000000],

    ["0.0001+0.0001", 0.0002],
    ["0.001*0.001", 0.000001],
    ["0.0001/2", 0.00005],

    ["1e10", 10000000000],
    ["1e20", 1e20],
    ["1e-10", 1e-10],
    ["1e-20", 1e-20],
  ])("should calculate large or small number expression %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   10. INVALID EXPRESSIONS
========================================================= */

describe("Invalid Expressions", () => {
  it.each([
    "",
    " ",
    "abc",
    "hello",
    "1a+2",
    "1+abc",

    "1+",
    "1-",
    "1*",
    "1/",
    "1%",

    "+",
    "-",
    "*",
    "/",
    "%",

    "*5",
    "/5",
    "%5",

    "1++",
    "1**2",
    "1//2",
    "1%%2",

    "1..2",
    "..5",
    ".",
    "5.5.5",

    "1e",
    "1e+",
    "1e-",

    "1  +2",
    "1+ 2",
    "1 +2",
    "1+2 ",

    "(1+2)",
    "2(3)",
    "2+()",
    "2+3)",

    "1,2",
    "1;2",
    "1&2",
    "1|2",
    "1^2",
    "1=2",
  ])("should reject invalid expression: %j", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow();
  });
});


/* =========================================================
   11. DIVISION BY ZERO
========================================================= */

describe("Division by Zero", () => {
  it.each([
    "1/0",
    "5/0",
    "100/0",
    "0/0",
    "-5/0",
    "5/-0",
    "10/(-0)",
  ])("should reject division by zero: %s", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow();
  });
});


/* =========================================================
   12. MODULUS BY ZERO
========================================================= */

describe("Modulus by Zero", () => {
  it.each([
    "1%0",
    "5%0",
    "100%0",
    "0%0",
    "-5%0",
    "5%-0",
  ])("should reject modulus by zero: %s", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow();
  });
});


/* =========================================================
   13. OVERFLOW AND NON-FINITE RESULTS
========================================================= */

describe("Overflow and Non-Finite Results", () => {
  it.each([
    "1e308*1e308",
    "1e308*10",
    "1e308+1e308",
  ])("should reject overflow expression: %s", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow();
  });
});


/* =========================================================
   14. RESULT FORMATTING
========================================================= */

describe("Result Formatting", () => {
  it.each([
    [0, "0"],
    [1, "1"],
    [-1, "-1"],

    [1.5, "1.5"],
    [0.25, "0.25"],
    [-2.5, "-2.5"],

    [100, "100"],
    [1000, "1000"],

    [0.000001, "0.000001"],
    [1e-7, "1e-7"],
    [1e21, "1e+21"],

    [-0, "0"],
    [0.30000000000000004, "0.30000000000000004"],
  ])("should format %s as %s", (value, expected) => {
    expect(formatResult(value)).toBe(expected);
  });

  it.each([
    NaN,
    Infinity,
    -Infinity,
    "5",
    null,
    undefined,
  ])("should reject invalid formatting value: %s", (value) => {
    expect(() => formatResult(value)).toThrow("Invalid result");
  });
});


/* =========================================================
   15. COMPLEX EXPRESSION COMBINATIONS
========================================================= */

describe("Complex Expression Combinations", () => {
  it.each([
    ["50%7+10*2", 21],
    ["100%9+5*5", 26],
    ["10+20*3-5", 65],
    ["100/5+10*2", 40],
    ["50-10/2+5", 50],

    ["10*5+20/2", 60],
    ["100-50%7*2", 98],
    ["20+30%7*3", 26],
    ["100/10+20%6", 12],

    ["-5+10*2", 15],
    ["10+-5*2", 0],
    ["-10+20/2", 0],
    ["5--5*2", 15],

    ["1.5*2+3.5", 6.5],
    ["10.5/2+1.5", 6.75],
    ["0.5*4+2.5", 4.5],

    ["1e2+50", 150],
    ["2e2*2-100", 300],
    ["1e3/10+50", 150],

    ["100%9+10*2-5", 16],
    ["50+20/5*3-10", 52],
    ["200-50*2+100/5", 120],
  ])("should calculate complex expression %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});

/* =========================================================
   16. UNARY OPERATOR EDGE CASES
========================================================= */

describe("Unary Operator Edge Cases", () => {
  it.each([
    ["+5", 5],
    ["+10", 10],
    ["+5+5", 10],
    ["+5-10", -5],

    ["5+-2", 3],
    ["5--2", 7],
    ["5*-2", -10],
    ["5/-2", -2.5],
    ["5%-2", 1],

    ["-5+-2", -7],
    ["-5--2", -3],
    ["-5*-2", 10],
    ["-5/-2", 2.5],
    ["-5%-2", -1],
  ])("should handle unary operators in %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   17. OPERATOR SEQUENCE EDGE CASES
========================================================= */

describe("Operator Sequence Edge Cases", () => {
  it.each([
    ["1++2", 3],
    ["1--2", 3],
    ["1+-2", -1],
    ["1-+2", -1],

    ["2*-3", -6],
    ["2/-2", -1],
    ["2%-3", 2],

    ["-2*3", -6],
    ["-2/-2", 1],
    ["-2%-3", -2],
  ])("should evaluate valid operator sequence %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   18. DECIMAL EDGE CASES
========================================================= */

describe("Decimal Edge Cases", () => {
  it.each([
    [".1", 0.1],
    [".5", 0.5],
    [".25", 0.25],
    ["1.", 1],
    ["5.", 5],
    ["10.+5", 15],

    [".5+.5", 1],
    [".5*2", 1],
    ["1.5*0", 0],
    ["0.5/0.5", 1],

    ["10.5%2", 0.5],
    ["5.5%2", 1.5],
    ["7.25%2", 1.25],
  ])("should handle decimal edge case %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   19. SCIENTIFIC NOTATION EDGE CASES
========================================================= */

describe("Scientific Notation Edge Cases", () => {
  it.each([
    ["1e+2", 100],
    ["1e-2", 0.01],
    ["2.5e2", 250],
    ["2.5e-2", 0.025],
    [".5e2", 50],
    [".5e-2", 0.005],

    ["1e2+1e2", 200],
    ["2e2-1e2", 100],
    ["2e2*2", 400],
    ["2e2/2", 100],

    ["1E+2", 100],
    ["1E-2", 0.01],
  ])("should handle scientific notation edge case %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   20. ZERO EDGE CASES
========================================================= */

describe("Zero Edge Cases", () => {
  it.each([
    ["0+0", 0],
    ["0-0", 0],
    ["0*10", 0],
    ["0/10", 0],
    ["0%10", 0],

    ["10+0", 10],
    ["10-0", 10],
    ["10*0", 0],

    ["-0+5", 5],
    ["-0-5", -5],
    ["-0*5", -0],
    ["-0%5", -0],
  ])("should handle zero expression %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   21. INTEGER PRECISION
========================================================= */

describe("Integer Precision", () => {
  it.each([
    ["9007199254740991", 9007199254740991],
    ["9007199254740991+1", 9007199254740992],
    ["9007199254740992+1", 9007199254740992],

    ["1000000000000000+1", 1000000000000001],
    ["1000000000000000*2", 2000000000000000],
  ])("should follow JavaScript Number precision in %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   22. LONG EXPRESSIONS
========================================================= */

describe("Long Expressions", () => {
  it.each([
    ["1+2+3+4+5+6+7+8+9+10", 55],
    ["10+20+30+40+50", 150],
    ["100-10-20-30-40", 0],

    ["2*3*4*5", 120],
    ["120/2/3/4", 5],

    ["1+2*3+4*5+6", 33],
    ["100-10*2+5*3", 95],

    ["1+2+3+4+5+6+7+8+9+10+11+12+13+14+15", 120],
  ])("should evaluate long expression %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   23. MALFORMED SCIENTIFIC NOTATION
========================================================= */

describe("Malformed Scientific Notation", () => {
  it.each([
    "1e",
    "1e+",
    "1e-",
    "1ee2",
    "1e2e3",
    "1e++2",
    "1e--2",
    "1e2.3",
    "e2",
    ".e2",
  ])("should reject malformed scientific notation: %s", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow();
  });
});


/* =========================================================
   24. MALFORMED DECIMAL EXPRESSIONS
========================================================= */

describe("Malformed Decimal Expressions", () => {
  it.each([
    "1..2",
    "1.2.3",
    "..5",
    "1..",
    "5.5.5",
    "1.2.3+4",
    "1.+.2.3",
  ])("should reject malformed decimal expression: %s", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow();
  });
});


/* =========================================================
   25. UNSUPPORTED OPERATORS AND SYNTAX
========================================================= */

describe("Unsupported Operators and Syntax", () => {
  it.each([
    "2^3",
    "2**3",
    "2//3",
    "2\\3",
    "2&3",
    "2|3",
    "2=3",
    "2<3",
    "2>3",

    "(1+2)",
    "1+(2)",
    "2(3)",
    "sqrt(4)",
    "sin(30)",
  ])("should reject unsupported syntax: %s", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow();
  });
});


/* =========================================================
   26. EXTREME NUMBER VALUES
========================================================= */

describe("Extreme Number Values", () => {
  it("should handle the smallest positive JavaScript Number", () => {
    expect(evaluateExpression("5e-324")).toBe(Number.MIN_VALUE);
  });

  it("should handle a value that underflows to zero", () => {
    expect(evaluateExpression("1e-324")).toBe(0);
  });

  it("should handle a large finite number", () => {
    expect(evaluateExpression("1e308")).toBe(1e308);
  });
});


/* =========================================================
   27. EXTREME SCIENTIFIC NOTATION
========================================================= */

describe("Extreme Scientific Notation", () => {
  it.each([
    ["1e308", 1e308],
    ["1e-323", 1e-323],
    ["1e-324", 0],
    ["1.7976931348623157e308", Number.MAX_VALUE],
    ["2.2250738585072014e-308", Number.MIN_NORMAL ?? 2.2250738585072014e-308],
  ])("should parse finite scientific boundary %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });

  it.each(["1e309", "1e999", "9e9999"])("should reject non-finite literal %s", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow("Invalid number");
  });
});


/* =========================================================
   28. NUMERIC PRECISION BOUNDARIES
========================================================= */

describe("Numeric Precision Boundaries", () => {
  it.each([
    ["9007199254740991+1", 9007199254740992],
    ["9007199254740992+2", 9007199254740994],
    ["9007199254740993", 9007199254740992],
    ["1e16+1", 1e16],
    ["1e-300*1e-20", 1e-320],
  ])("should follow IEEE-754 Number behavior for %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });

  it("should preserve the remainder sign of a negative dividend", () => {
    expect(evaluateExpression("-8%3")).toBe(-2);
  });
});


/* =========================================================
   29. PARSER BOUNDARIES AND ERROR HANDLING
========================================================= */

describe("Parser Boundary and Error Handling", () => {
  it.each([
    ["+1", 1],
    ["--1", 1],
    ["1---2", -1],
    ["1+-+2", -1],
    ["1e2e3", undefined],
  ])("valid unary or exponent boundary: %s", (expression, expected) => {
    if (expected === undefined) {
      expect(() => evaluateExpression(expression)).toThrow("Invalid expression");
    } else {
      expect(evaluateExpression(expression)).toBe(expected);
    }
  });

  it.each(["1e309", "1/0", "1%0", "1+", "1**2", "(1+2)", " 1+2"])(
    "should throw an Error for rejected input %j",
    (expression) => {
      expect(() => evaluateExpression(expression)).toThrow(Error);
    },
  );

  it.each(["", null, undefined, 12, {}, "1+2\n"])(
    "should reject non-string or newline input %j",
    (input) => {
      expect(() => evaluateExpression(input)).toThrow();
    },
  );
});


/* =========================================================
   30. INPUT LENGTH AND STRESS
========================================================= */

describe("Input Length and Stress", () => {
  it("should evaluate a 500-term addition without losing terms", () => {
    const expression = Array(500).fill("1").join("+");
    expect(evaluateExpression(expression)).toBe(500);
  });

  it("should evaluate a long mixed expression with known result", () => {
    const expression = Array(100).fill("2+3*4").join("+");
    expect(evaluateExpression(expression)).toBe(1400);
  });

  it("should handle a long numeric literal within finite range", () => {
    expect(evaluateExpression("9".repeat(100))).toBe(Number("9".repeat(100)));
  });
});


/* =========================================================
   31. DETERMINISTIC PROPERTY-BASED CHECKS
========================================================= */

describe("Deterministic Arithmetic Properties", () => {
  it("should match direct arithmetic for a reproducible set of safe operands", () => {
    // Fixed seed keeps this property-style test reproducible on every run.
    let seed = 0x5eed1234;
    const randomInt = (max) => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed % max;
    };
    const operators = ["+", "-", "*", "/", "%"];

    for (let i = 0; i < 250; i += 1) {
      const left = randomInt(1000) + 1;
      const right = randomInt(999) + 1;
      const operator = operators[randomInt(operators.length)];
      const expected = operator === "+" ? left + right
        : operator === "-" ? left - right
        : operator === "*" ? left * right
        : operator === "/" ? left / right
        : left % right;

      expect(evaluateExpression(`${left}${operator}${right}`)).toBe(expected);
    }
  });

  it("should satisfy additive and multiplicative identity properties", () => {
    for (let value = -100; value <= 100; value += 1) {
      expect(evaluateExpression(`${value}+0`)).toBe(value);
      expect(evaluateExpression(`${value}*1`)).toBe(value);
    }
  });
});


/* =========================================================
   32. REGRESSION CASES
========================================================= */

describe("Regression Cases", () => {
  it.each([
    ["10+20/5*2", 18],
    ["-5+10*2", 15],
    ["1e-7+1e-7", 2e-7],
    ["5%-2", 1],
    ["-5%-2", -1],
    ["0.1+0.2", 0.30000000000000004],
  ])("should retain established result for %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});


/* =========================================================
   33. SEEDED MULTI-OPERATOR PROPERTY CHECKS
========================================================= */

describe("Seeded Multi-Operator Property Checks", () => {
  it("should agree with an independent precedence-aware reference evaluator", () => {
    let seed = 0xc0ffee;
    const randomInt = (max) => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed % max;
    };
    const operators = ["+", "-", "*", "/", "%"];

    // Reference evaluation: first collapse * / %, then fold + and - left to right.
    const referenceEvaluate = (numbers, ops) => {
      const reducedNumbers = [numbers[0]];
      const reducedOperators = [];

      for (let index = 0; index < ops.length; index += 1) {
        const operator = ops[index];
        const right = numbers[index + 1];
        if (operator === "*") {
          reducedNumbers[reducedNumbers.length - 1] *= right;
        } else if (operator === "/") {
          reducedNumbers[reducedNumbers.length - 1] /= right;
        } else if (operator === "%") {
          reducedNumbers[reducedNumbers.length - 1] %= right;
        } else {
          reducedOperators.push(operator);
          reducedNumbers.push(right);
        }
      }

      let result = reducedNumbers[0];
      for (let index = 0; index < reducedOperators.length; index += 1) {
        result = reducedOperators[index] === "+"
          ? result + reducedNumbers[index + 1]
          : result - reducedNumbers[index + 1];
      }
      return result;
    };

    for (let sample = 0; sample < 500; sample += 1) {
      const count = 2 + randomInt(8);
      const numbers = Array.from({ length: count }, () => randomInt(20) + 1);
      const ops = Array.from({ length: count - 1 }, () => operators[randomInt(operators.length)]);
      const expression = numbers.reduce((text, number, index) =>
        index === 0 ? String(number) : `${text}${ops[index - 1]}${number}`, "");

      expect(evaluateExpression(expression)).toBe(referenceEvaluate(numbers, ops));
    }
  });
});


/* =========================================================
   34. TOKENIZATION BOUNDARIES
========================================================= */

describe("Tokenization Boundaries", () => {
  it.each([
    ["0007+0003", 10],
    ["000.50+0.5", 1],
    ["1e2+3e1", 130],
    ["1e-2*1e2", 1],
    [".0001*10000", 1],
    ["1e+0002", 100],
  ])("should tokenize valid adjacent number forms in %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });

  it.each([
    "1e2.0",
    "1e2+e3",
    "1e2+.",
    "1e2+-e3",
    "1e2++e3",
    "1e2+2e",
    "1e2+2e--3",
    "1.0.0+2",
  ])("should reject malformed token boundary %j", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow("Invalid expression");
  });
});


/* =========================================================
   35. INTERMEDIATE RESULT VALIDATION
========================================================= */

describe("Intermediate Result Validation", () => {
  it.each([
    "1e308*10/10",
    "1e308+1e308-1e308",
    "1e308*1e308/1e308",
    "1/0*0",
    "1%0+1",
  ])("should reject non-finite intermediate or zero-divisor result in %s", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow();
  });

  it("should keep finite operations valid when later operations return to range", () => {
    expect(evaluateExpression("1e308/10/10")).toBe(1e306);
    expect(evaluateExpression("1e-300*1e100")).toBe(1e-200);
  });
});


/* =========================================================
   36. LONG UNARY SIGN CHAINS
========================================================= */

describe("Long Unary Sign Chains", () => {
  it.each([
    [1, -1],
    [2, 1],
    [3, -1],
    [10, 1],
    [101, -1],
    [500, 1],
  ])("should apply %i leading minus signs by parity", (count, expected) => {
    expect(evaluateExpression(`${"-".repeat(count)}1`)).toBe(expected);
  });

  it("should handle a long sequence of unary plus signs", () => {
    expect(evaluateExpression(`${"+".repeat(500)}42`)).toBe(42);
  });

  it.each([
    "-".repeat(20),
    "+".repeat(20),
    "-".repeat(20) + "+",
  ])("should reject a sign chain without a final number", (expression) => {
    expect(() => evaluateExpression(expression)).toThrow();
  });
});


/* =========================================================
   37. VERY LONG INPUTS
========================================================= */

describe("Very Long Inputs", () => {
  it("should evaluate a 2,000-term sum", () => {
    expect(evaluateExpression(Array(2000).fill("1").join("+")).toString()).toBe("2000");
  });

  it("should reject a numeric literal that overflows despite its length", () => {
    expect(() => evaluateExpression("9".repeat(400))).toThrow("Invalid number");
  });

  it("should reject a very long malformed expression", () => {
    const malformed = `${Array(1000).fill("1").join("+")}+`;
    expect(() => evaluateExpression(malformed)).toThrow();
  });
});


/* =========================================================
   38. FORMAT RESULT BOUNDARIES
========================================================= */

describe("Format Result Boundaries", () => {
  it.each([
    [Number.MAX_VALUE, String(Number.MAX_VALUE)],
    [Number.MIN_VALUE, String(Number.MIN_VALUE)],
    [Number.MAX_SAFE_INTEGER, "9007199254740991"],
    [Number.MIN_SAFE_INTEGER, "-9007199254740991"],
    [1e-6, "0.000001"],
    [1e-7, "1e-7"],
    [1e20, "100000000000000000000"],
    [1e21, "1e+21"],
  ])("should use JavaScript's string form for boundary value %s", (value, expected) => {
    expect(formatResult(value)).toBe(expected);
  });
});


/* =========================================================
   39. UNDERFLOWED ZERO AND SIGNED ZERO
========================================================= */

describe("Underflowed Zero and Signed Zero", () => {
  it.each([
    ["1e-999", 0],
    ["-1e-999", -0],
    ["1e-323/1e-1", 1e-322],
    ["-1e-323/1e-1", -1e-322],
  ])("should preserve Number underflow behavior for %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });

  it.each(["1/1e-999", "1%-1e-999"])(
    "should treat an underflowed zero divisor as zero in %s",
    (expression) => {
      expect(() => evaluateExpression(expression)).toThrow("Division by zero");
    },
  );
});


/* =========================================================
   40. INVALID CHARACTER MUTATIONS
========================================================= */

describe("Invalid Character Mutations", () => {
  it.each(["@", "_", " ", "(", ")", ",", "^", "#", "\n"])(
    "should reject a valid expression mutated with %j",
    (invalidCharacter) => {
      const expression = `12${invalidCharacter}+3`;
      expect(() => evaluateExpression(expression)).toThrow("Invalid expression");
    },
  );
});


/* =========================================================
   41. EXHAUSTIVE SMALL INTEGER OPERATIONS
========================================================= */

describe("Exhaustive Small Integer Operations", () => {
  it("should match JavaScript arithmetic for every pair from -5 through 5", () => {
    const operators = [
      ["+", (left, right) => left + right],
      ["-", (left, right) => left - right],
      ["*", (left, right) => left * right],
      ["/", (left, right) => left / right],
      ["%", (left, right) => left % right],
    ];

    for (let left = -5; left <= 5; left += 1) {
      for (let right = -5; right <= 5; right += 1) {
        for (const [operator, calculate] of operators) {
          const expression = `${left}${operator}${right}`;
          if ((operator === "/" || operator === "%") && right === 0) {
            expect(() => evaluateExpression(expression)).toThrow("Division by zero");
          } else {
            expect(evaluateExpression(expression)).toBe(calculate(left, right));
          }
        }
      }
    }
  });
});


/* =========================================================
   42. SEEDED DECIMAL AND EXPONENT PROPERTY CHECKS
========================================================= */

describe("Seeded Decimal and Exponent Property Checks", () => {
  it("should match direct arithmetic for reproducible decimal operands", () => {
    let seed = 0xdec1a1;
    const randomInt = (max) => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed % max;
    };
    const decimalFromCents = (cents) => {
      const sign = cents < 0 ? "-" : "";
      const absolute = Math.abs(cents);
      return `${sign}${Math.floor(absolute / 100)}.${String(absolute % 100).padStart(2, "0")}`;
    };
    const operations = [
      ["+", (left, right) => left + right],
      ["-", (left, right) => left - right],
      ["*", (left, right) => left * right],
      ["/", (left, right) => left / right],
      ["%", (left, right) => left % right],
    ];

    for (let sample = 0; sample < 300; sample += 1) {
      const leftCents = randomInt(200001) - 100000;
      const rightCents = randomInt(200000) - 100000;
      const [operator, calculate] = operations[randomInt(operations.length)];
      if ((operator === "/" || operator === "%") && rightCents === 0) continue;

      const leftText = decimalFromCents(leftCents);
      const rightText = decimalFromCents(rightCents);
      const expression = `${leftText}${operator}${rightText}`;
      const expected = calculate(Number(leftText), Number(rightText));
      expect(evaluateExpression(expression)).toBe(expected);
    }
  });

  it.each([
    ["1.25e2+2.5e1", 150],
    ["-3.5e-2*2e2", -7.000000000000001],
    ["6.4e3/8e1", 80],
    ["7.5e-1%2.5e-1", 0],
    ["1e-200+1e-200", 2e-200],
    ["1e200/1e100", 1e100],
  ])("should combine decimal mantissas and exponents in %s", (expression, expected) => {
    expect(evaluateExpression(expression)).toBe(expected);
  });
});
