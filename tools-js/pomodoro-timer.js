const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const bellSound = document.getElementById("bellSound");
const modeButtons = document.querySelectorAll(".mode-btn");

let durations = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

let currentMode = "focus";
let timerDuration = durations[currentMode];
let timerRunning = false;
let endTime = null;
let interval = null;

// Format time
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Update display
function updateDisplay(seconds) {
  timerEl.textContent = formatTime(seconds);
}

// Start Timer (timestamp-based)
function startTimer() {
  if (timerRunning) return;

  timerRunning = true;
  startBtn.textContent = "Pause";
  endTime = Date.now() + timerDuration * 1000;

  interval = setInterval(() => {
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    updateDisplay(remaining);

    if (remaining === 0) {
      stopTimer();
      bellSound.play();
    }
  }, 1000);
}

// Pause Timer
function pauseTimer() {
  timerRunning = false;
  clearInterval(interval);
  timerDuration = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  startBtn.textContent = "Start";
}

// Stop Timer
function stopTimer() {
  clearInterval(interval);
  timerRunning = false;
  startBtn.textContent = "Start";
}

// Reset Timer
function resetTimer() {
  stopTimer();
  timerDuration = durations[currentMode];
  updateDisplay(timerDuration);
}

// Mode Change
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentMode = btn.dataset.mode;
    timerDuration = durations[currentMode];
    resetTimer();
  });
});

// Button Events
startBtn.addEventListener("click", () => {
  timerRunning ? pauseTimer() : startTimer();
});

resetBtn.addEventListener("click", resetTimer);

// Init
updateDisplay(timerDuration);
