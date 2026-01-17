const longUrl = document.getElementById("longUrl");
const shortUrl = document.getElementById("shortUrl");
const shortenBtn = document.getElementById("shortenBtn");
const copyBtn = document.getElementById("copyBtn");
const openBtn = document.getElementById("openBtn");
const status = document.getElementById("status");

function setStatus(msg, ok = true) {
  status.textContent = msg;
  status.style.color = ok ? "green" : "red";
}

shortenBtn.addEventListener("click", async () => {
  const url = longUrl.value.trim();

  if (!url.startsWith("http")) {
    setStatus("Please enter a valid URL", false);
    return;
  }

  setStatus("Shortening...");

  try {
    const res = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
    );

    const short = await res.text();
    shortUrl.value = short;
    setStatus("URL shortened successfully ✓");
  } catch (err) {
    setStatus("Failed to shorten URL", false);
  }
});

copyBtn.addEventListener("click", () => {
  if (!shortUrl.value) return;
  navigator.clipboard.writeText(shortUrl.value);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
});

openBtn.addEventListener("click", () => {
  if (!shortUrl.value) return;
  window.open(shortUrl.value, "_blank");
});
