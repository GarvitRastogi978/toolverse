const typeEl = document.getElementById("type");
const countEl = document.getElementById("count");
const output = document.getElementById("output");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const baseText =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";

const words = baseText.split(" ");

function generateWords(count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }
  return result.join(" ");
}

function generateSentences(count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    const len = Math.floor(Math.random() * 8) + 8;
    let sentence = generateWords(len);
    result.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".");
  }
  return result.join(" ");
}

function generateParagraphs(count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    const len = Math.floor(Math.random() * 3) + 3;
    result.push(generateSentences(len));
  }
  return result.join("\n\n");
}

generateBtn.addEventListener("click", () => {
  const type = typeEl.value;
  const count = parseInt(countEl.value);

  let text = "";

  if (type === "words") text = generateWords(count);
  if (type === "sentences") text = generateSentences(count);
  if (type === "paragraphs") text = generateParagraphs(count);

  output.value = text;
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(output.value);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
});
