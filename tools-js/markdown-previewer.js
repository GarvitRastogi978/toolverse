const input = document.getElementById("markdownInput");
const preview = document.getElementById("markdownPreview");

function parseMarkdown(md) {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`(.*?)`/gim, "<code>$1</code>")
    .replace(/\n$/gim, "<br />");
}

input.addEventListener("input", () => {
  preview.innerHTML = parseMarkdown(input.value);
});

// Default content
input.value = `# Markdown Previewer

## Features
- **Bold**
- *Italic*
- \`Inline code\`

Start typing on the left ✨`;
preview.innerHTML = parseMarkdown(input.value);
