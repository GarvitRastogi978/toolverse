    const display = document.getElementById("display");
    const buttons = document.querySelectorAll(".calculator button");
    const equalsBtn = document.getElementById("equals");
    const clearBtn = document.getElementById("clear");
    const toggleModeBtn = document.getElementById("toggleMode");
    const scientificPanel = document.getElementById("scientific");

    let expression = "";

    buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;
        if (!value) return;

        if (value === "PI") expression += Math.PI;
        else if (value === "E") expression += Math.E;
        else expression += value;

        display.value = expression;
    });
    });

    equalsBtn.addEventListener("click", calculate);
    clearBtn.addEventListener("click", () => {
    expression = "";
    display.value = "";
    });

    toggleModeBtn.addEventListener("click", () => {
    scientificPanel.classList.toggle("hidden");
    toggleModeBtn.textContent =
        scientificPanel.classList.contains("hidden")
        ? "Scientific Mode"
        : "Normal Mode";
    });

    function calculate() {
  try {
    let exp = expression;

    // 1. Fix Brackets: Count '(' and ')' and append missing ones
    const openBrackets = (exp.match(/\(/g) || []).length;
    const closeBrackets = (exp.match(/\)/g) || []).length;
    const missing = openBrackets - closeBrackets;
    
    if (missing > 0) {
      exp += ")".repeat(missing);
    }

    // 2. Map scientific functions to JavaScript Math object
    exp = exp
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/log/g, "Math.log10")
      .replace(/ln/g, "Math.log")
      .replace(/sqrt/g, "Math.sqrt");

    // Special handling for xʸ (pow)
    // Note: If user types pow(2,3), this works. 
    // If you want a simpler x^y, you might replace 'pow(' with 'Math.pow('
    exp = exp.replace(/pow/g, "Math.pow");

    // 3. Evaluate
    const result = eval(exp);
    
    // Check if result is a valid number
    if (isNaN(result) || !isFinite(result)) {
      throw new Error("Invalid Math");
    }

    expression = result.toString();
    display.value = expression;
  } catch (err) {
    display.value = "Error";
    expression = "";
  }
}

    /* Keyboard Support */
    document.addEventListener("keydown", e => {
    if (
        /[0-9+\-*/.]/.test(e.key)
    ) {
        expression += e.key;
        display.value = expression;
    } else if (e.key === "Enter") {
        calculate();
    } else if (e.key === "Backspace") {
        expression = expression.slice(0, -1);
        display.value = expression;
    }
    });
