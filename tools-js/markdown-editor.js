const input = document.getElementById("markdownInput");
const preview = document.getElementById("markdownPreview");
const downloadBtn = document.getElementById("downloadMd");
const pdfBtn = document.getElementById("exportPdf");

// Default content
input.value = `# Markdown Editor

## Features
- Live preview
- Split view
- PDF export
- Download .md file

### Example Code
\`\`\`js
console.log("Hello Markdown!");
\`\`\`
`;

function renderMarkdown() {
  preview.innerHTML = marked.parse(input.value);
}

input.addEventListener("input", renderMarkdown);
renderMarkdown();

/* Download .md */
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([input.value], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "markdown.md";
  link.click();
});

/* Export PDF */
pdfBtn.addEventListener("click", () => {
  const opt = {
    margin: 0.5,
    filename: "markdown.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };
  html2pdf().set(opt).from(preview).save();
});
