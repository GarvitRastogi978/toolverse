const repoInput = document.getElementById("repoUrl");
const branchSelect = document.getElementById("branch");
const downloadBtn = document.getElementById("downloadBtn");
const statusText = document.getElementById("status");

downloadBtn.addEventListener("click", () => {
  const url = repoInput.value.trim();
  if (!isValidGitHubRepo(url)) {
    showStatus("❌ Invalid GitHub repository URL", true);
    return;
  }

  const { user, repo } = parseRepo(url);
  const branch = branchSelect.value;

  const zipUrl = `https://github.com/${user}/${repo}/archive/refs/heads/${branch}.zip`;

  showStatus("⬇ Preparing download...", false);
  window.location.href = zipUrl;
});

/* Helpers */
function isValidGitHubRepo(url) {
  return /^https:\/\/github\.com\/[^\/]+\/[^\/]+/.test(url);
}

function parseRepo(url) {
  const parts = url.replace("https://github.com/", "").split("/");
  return {
    user: parts[0],
    repo: parts[1].replace(".git", "")
  };
}

function showStatus(msg, error) {
  statusText.textContent = msg;
  statusText.style.color = error ? "var(--danger)" : "var(--success)";
}
