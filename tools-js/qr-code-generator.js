const input = document.getElementById("qrInput");
const generateBtn = document.getElementById("generateQR");
const result = document.getElementById("qrResult");
const downloadBtn = document.getElementById("downloadQR");

generateBtn.addEventListener("click", () => {
  const value = input.value.trim();
  if (!value) return;

  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(value)}`;

  result.innerHTML = `<img src="${qrURL}" alt="QR Code" />`;

  downloadBtn.href = qrURL;
  downloadBtn.style.display = "inline-block";
});
