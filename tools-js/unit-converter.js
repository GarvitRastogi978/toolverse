const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

const rates = {
    m: 1,
    km: 1000,
    mi: 1609.34,
    ft: 0.3048,
    in: 0.0254,
    cm: 0.01,
    yd: 0.9144,
    mm: 0.001
};

function convert() {
  const value = parseFloat(inputValue.value);
  if (isNaN(value)) {
    result.textContent = "Result: —";
    return;
  }

  const meters = value * rates[fromUnit.value];
  const converted = meters / rates[toUnit.value];

  result.textContent = `Result: ${converted.toFixed(4)}`;
}

[inputValue, fromUnit, toUnit].forEach(el =>
  el.addEventListener("input", convert)
);
