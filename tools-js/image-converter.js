const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const format = document.getElementById("format");
const quality = document.getElementById("quality");
const convertBtn = document.getElementById("convertBtn");
const status = document.getElementById("status");

let img = new Image();

input.addEventListener("change", () => {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    img.src = e.target.result;
    preview.src = img.src;
  };
  reader.readAsDataURL(file);
});

convertBtn.addEventListener("click", () => {
  if (!img.src) {
    status.textContent = "Please upload an image";
    status.style.color = "red";
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const mime = format.value;
  const q = parseFloat(quality.value);

  canvas.toBlob(blob => {
    const link = document.createElement("a");
    const ext = mime.split("/")[1];

    link.href = URL.createObjectURL(blob);
    link.download = `converted.${ext}`;
    link.click();

    status.textContent = "Image converted successfully ✓";
    status.style.color = "green";
  }, mime, q);
});
