const { PDFDocument } = PDFLib;

const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");
const status = document.getElementById("status");

/* Tabs */
tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

/* MERGE PDF */
document.getElementById("mergeBtn").onclick = async () => {
  const files = document.getElementById("mergeInput").files;
  if (!files.length) return setStatus("Select PDFs to merge", false);

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => mergedPdf.addPage(p));
  }

  downloadPdf(await mergedPdf.save(), "merged.pdf");
  setStatus("PDFs merged successfully ✓");
};

/* SPLIT PDF */
document.getElementById("splitBtn").onclick = async () => {
  const file = document.getElementById("splitInput").files[0];
  const pageInput = document.getElementById("pages").value;

  if (!file || !pageInput) return setStatus("Upload PDF and pages", false);

  const srcPdf = await PDFDocument.load(await file.arrayBuffer());
  const newPdf = await PDFDocument.create();
  const pages = parsePages(pageInput, srcPdf.getPageCount());

  const copied = await newPdf.copyPages(srcPdf, pages);
  copied.forEach(p => newPdf.addPage(p));

  downloadPdf(await newPdf.save(), "split.pdf");
  setStatus("PDF split successfully ✓");
};

/* Helpers */
function parsePages(input, max) {
  const pages = new Set();
  input.split(",").forEach(p => {
    if (p.includes("-")) {
      let [a, b] = p.split("-").map(Number);
      for (let i = a; i <= b; i++) pages.add(i - 1);
    } else {
      pages.add(Number(p) - 1);
    }
  });
  return [...pages].filter(p => p >= 0 && p < max);
}

function downloadPdf(bytes, name) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
}

function setStatus(msg, ok = true) {
  status.textContent = msg;
  status.style.color = ok ? "green" : "red";
}
