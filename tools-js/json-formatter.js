const input = document.getElementById("jsonInput");
const output = document.getElementById("jsonOutput");
const formatBtn = document.getElementById("formatBtn");
const minifyBtn = document.getElementById("minifyBtn");
const copyBtn = document.getElementById("copyBtn");
const status = document.getElementById("status");

function setStatus(msg, ok = true) {
  status.textContent = msg;
  status.style.color = ok ? "green" : "red";
}

formatBtn.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed, null, 2);
    setStatus("Valid JSON ✓");
  } catch (err) {
    setStatus("Invalid JSON ✕", false);
    output.value = "";
  }
});

minifyBtn.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed);
    setStatus("Minified JSON ✓");
  } catch (err) {
    setStatus("Invalid JSON ✕", false);
    output.value = "";
  }
});

copyBtn.addEventListener("click", () => {
  if (!output.value) return;
  navigator.clipboard.writeText(output.value);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
});
