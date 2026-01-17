const hexInput = document.getElementById("hex");
const rgbInput = document.getElementById("rgb");
const hslInput = document.getElementById("hsl");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const colorPicker = document.getElementById("colorPicker"); // Picker reference
const paletteGrid = document.getElementById("paletteGrid");

function setStatus(msg, ok = true) {
  status.textContent = msg;
  status.style.color = ok ? "green" : "red";
}

function generatePalette(hex) {
  paletteGrid.innerHTML = "";
  const rgb = hexToRgb(hex.replace("#", ""));
  if (!rgb) return;

  for (let i = -4; i <= 4; i++) {
    const factor = i * 15;
    const r = Math.min(255, Math.max(0, rgb.r + factor));
    const g = Math.min(255, Math.max(0, rgb.g + factor));
    const b = Math.min(255, Math.max(0, rgb.b + factor));

    const shade = rgbToHex(r, g, b);
    const box = document.createElement("div");
    box.className = "palette-color";
    box.style.background = shade;
    box.title = shade;
    box.onclick = () => {
      navigator.clipboard.writeText(shade);
      setStatus("Shade Copied!");
      setTimeout(() => setStatus("✓"), 1000);
    };
    paletteGrid.appendChild(box);
  }
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length !== 6) return null;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function updateAll(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  hexInput.value = hex;
  rgbInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  hslInput.value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
  colorPicker.value = hex;
  preview.style.background = hex;
  
  syncRgbSliders(rgb.r, rgb.g, rgb.b);
  syncHslSliders(hsl.h, hsl.s, hsl.l);
  generatePalette(hex);
}

// Color Picker Listener
colorPicker.addEventListener("input", (e) => {
  updateAll(e.target.value);
  setStatus("✓");
});

hexInput.addEventListener("input", () => {
  const rgb = hexToRgb(hexInput.value);
  if (!rgb) return setStatus("Invalid HEX", false);
  updateAll(hexInput.value);
  setStatus("✓");
});

rgbInput.addEventListener("input", () => {
  const parts = rgbInput.value.split(",").map(Number);
  if (parts.length === 3 && !parts.some(n => n < 0 || n > 255)) {
    const hex = rgbToHex(parts[0], parts[1], parts[2]);
    updateAll(hex);
    setStatus("✓");
  }
});

hslInput.addEventListener("input", () => {
  const parts = hslInput.value.replace(/%/g, "").split(",").map(Number);
  if (parts.length === 3) {
    const rgb = hslToRgb(parts[0], parts[1], parts[2]);
    updateAll(rgbToHex(rgb.r, rgb.g, rgb.b));
    setStatus("✓");
  }
});

document.getElementById("copyHex").onclick = () => {
  navigator.clipboard.writeText(hexInput.value);
  setStatus("HEX Copied!");
  setTimeout(() => setStatus("✓"), 1000);
};

document.getElementById("copyRgb").onclick = () => {
  navigator.clipboard.writeText(`rgb(${rgbInput.value})`);
  setStatus("RGB Copied!");
  setTimeout(() => setStatus("✓"), 1000);
};

document.getElementById("copyHsl").onclick = () => {
  navigator.clipboard.writeText(`hsl(${hslInput.value})`);
  setStatus("HSL Copied!");
  setTimeout(() => setStatus("✓"), 1000);
};

// Slider Logic
const rRange = document.getElementById("rRange"), gRange = document.getElementById("gRange"), bRange = document.getElementById("bRange");
const hRange = document.getElementById("hRange"), sRange = document.getElementById("sRange"), lRange = document.getElementById("lRange");

function syncRgbSliders(r, g, b) { rRange.value = r; gRange.value = g; bRange.value = b; }
function syncHslSliders(h, s, l) { hRange.value = h; sRange.value = s; lRange.value = l; }

[rRange, gRange, bRange].forEach(s => s.oninput = () => {
  const hex = rgbToHex(+rRange.value, +gRange.value, +bRange.value);
  updateAll(hex);
});

[hRange, sRange, lRange].forEach(s => s.oninput = () => {
  const rgb = hslToRgb(+hRange.value, +sRange.value, +lRange.value);
  updateAll(rgbToHex(rgb.r, rgb.g, rgb.b));
});