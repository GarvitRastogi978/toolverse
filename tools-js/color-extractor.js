/* ================================
   COLOR EXTRACTOR TOOL – FULL JS
   ================================ */

const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");

const extractBtn = document.getElementById("extractBtn");
const paletteDiv = document.getElementById("palette");
const tableBody = document.getElementById("colorTable");

const colorCount = document.getElementById("colorCount");
const countValue = document.getElementById("countValue");
const downloadBtn = document.getElementById("downloadPalette");

let img = new Image();
let colors = [];

/* ================================
   UI EVENTS
   ================================ */

colorCount.addEventListener("input", () => {
  countValue.textContent = colorCount.value;
});

imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => (img.src = reader.result);
  reader.readAsDataURL(file);
});

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};

/* ================================
   EXTRACT DOMINANT COLORS (SMART)
   ================================ */

extractBtn.addEventListener("click", () => {
  if (!canvas.width) return alert("Please upload an image first");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const buckets = {};

  // Smart sampling + quantization
  for (let i = 0; i < imageData.length; i += 40) {
    const r = Math.round(imageData[i] / 32) * 32;
    const g = Math.round(imageData[i + 1] / 32) * 32;
    const b = Math.round(imageData[i + 2] / 32) * 32;

    const key = `${r},${g},${b}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }

  colors = Object.entries(buckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Number(colorCount.value))
    .map(entry => entry[0].split(",").map(Number));

  renderPalette();
});

/* ================================
   PICK COLOR FROM IMAGE
   ================================ */

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const picked = [pixel[0], pixel[1], pixel[2]];

  colors.unshift(picked);
  colors = colors.slice(0, 20);

  renderPalette();
});

/* ================================
   RENDER PALETTE + TABLE
   ================================ */

function renderPalette() {
  paletteDiv.innerHTML = "";
  tableBody.innerHTML = "";

  colors.forEach(([r, g, b]) => {
    const hex = rgbToHex(r, g, b);

    /* Palette tile */
    const tile = document.createElement("div");
    tile.className = "palette-color";
    tile.style.backgroundColor = hex;
    tile.title = `Click to copy ${hex}`;

    tile.addEventListener("click", () => {
      navigator.clipboard.writeText(hex);
      tile.style.outline = "3px solid #000";
      setTimeout(() => (tile.style.outline = "none"), 300);
    });

    paletteDiv.appendChild(tile);

    /* Table row */
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="color-dot" style="background:${hex}"></span></td>
      <td>${hex}</td>
      <td>rgb(${r}, ${g}, ${b})</td>
    `;
    tableBody.appendChild(row);
  });
}

/* ================================
   DOWNLOAD PALETTE AS IMAGE
   ================================ */

downloadBtn.addEventListener("click", () => {
  if (!colors.length) return alert("No colors to download");

  const swatchWidth = 100;
  const paletteCanvas = document.createElement("canvas");
  paletteCanvas.width = colors.length * swatchWidth;
  paletteCanvas.height = 120;

  const pCtx = paletteCanvas.getContext("2d");

  colors.forEach(([r, g, b], i) => {
    const hex = rgbToHex(r, g, b);
    pCtx.fillStyle = hex;
    pCtx.fillRect(i * swatchWidth, 0, swatchWidth, 120);
  });

  const link = document.createElement("a");
  link.href = paletteCanvas.toDataURL("image/png");
  link.download = "color-palette.png";
  link.click();
});

/* ================================
   UTILS
   ================================ */

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}
