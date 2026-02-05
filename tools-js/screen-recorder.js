const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const preview = document.getElementById("preview");
const downloadLink = document.getElementById("downloadLink");

let mediaRecorder;
let recordedChunks = [];
let stream;

startBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 },
      audio: true
    });

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm"
    });

    recordedChunks = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = handleStop;

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } catch (err) {
    alert("Screen recording permission denied.");
  }
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  stream.getTracks().forEach(track => track.stop());

  startBtn.disabled = false;
  stopBtn.disabled = true;
});

function handleStop() {
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);

  preview.src = url;
  downloadLink.href = url;
  downloadLink.classList.remove("hidden");
}
