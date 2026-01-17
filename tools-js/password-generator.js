const lengthEl = document.getElementById("length");
const upperEl = document.getElementById("upper");
const lowerEl = document.getElementById("lower");
const numberEl = document.getElementById("numbers");
const symbolEl = document.getElementById("symbols");
const output = document.getElementById("output");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUM = "0123456789";
const SYM = "!@#$%^&*()_+";

function generatePassword() {
  let chars = "";
  if (upperEl.checked) chars += UPPER;
  if (lowerEl.checked) chars += LOWER;
  if (numberEl.checked) chars += NUM;
  if (symbolEl.checked) chars += SYM;

  if (!chars) {
    output.value = "Select at least one option";
    return;
  }

  let password = "";
  for (let i = 0; i < lengthEl.value; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  output.value = password;
}

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(output.value);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
});
