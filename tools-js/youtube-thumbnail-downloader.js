const input = document.getElementById("ytUrl");
const button = document.getElementById("fetchBtn");
const container = document.getElementById("thumbnailContainer");

const thumbnailSizes = [
  { label: "Max Resolution", file: "maxresdefault.jpg" },
  { label: "High Quality", file: "hqdefault.jpg" },
  { label: "Medium Quality", file: "mqdefault.jpg" },
  { label: "Standard Quality", file: "sddefault.jpg" },
  { label: "Default", file: "default.jpg" }
];

button.addEventListener("click", () => {
  const url = input.value.trim();
  const videoId = extractVideoId(url);

  if (!videoId) {
    alert("Please enter a valid YouTube URL");
    return;
  }

  renderThumbnails(videoId);
});

function extractVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function renderThumbnails(videoId) {
  container.innerHTML = "";

  thumbnailSizes.forEach(size => {
    const imageUrl = `https://img.youtube.com/vi/${videoId}/${size.file}`;

    const card = document.createElement("div");
    card.className = "thumbnail-card";

    card.innerHTML = `
      <img src="${imageUrl}" alt="${size.label} Thumbnail">
      <h4>${size.label}</h4>
      <a href="${imageUrl}" target="_blank" class="btn">
        Download
      </a>
      <p class="hint">Right-click → Save image as</p>
    `;

    container.appendChild(card);
  });
}
