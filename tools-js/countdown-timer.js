/**
 * ToolVerse: Countdown Timer Logic
 * Features: Hour/Min/Sec input, Quick Presets, Alarm Sound, and Visual Pulse
 */

// 1. GLOBAL SCOPE: Define audio and timer variables
const audio = new Audio('../assets/sound/alarm-tone.mp3');
audio.loop = true;

let timerInterval;
let totalSeconds = 0;
let isPaused = false;

document.addEventListener('DOMContentLoaded', () => {
    // 2. Element Selectors
    const display = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('startTimerBtn');
    const pauseBtn = document.getElementById('pauseTimerBtn');
    const resetBtn = document.getElementById('resetTimerBtn');
    const statusDiv = document.getElementById('timerStatus');
    
    // Input Fields
    const hrsInput = document.getElementById('hrsInput');
    const minInput = document.getElementById('minInput');
    const secInput = document.getElementById('secInput');
    
    // Preset Buttons
    const presetButtons = document.querySelectorAll('.preset-btn');

    // 3. Update Digital Display
    function updateDisplay() {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        display.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    // 4. Start/Resume Logic
    function startTimer() {
        // If we are starting fresh (not resuming from pause)
        if (!isPaused) {
            const h = parseInt(hrsInput.value) || 0;
            const m = parseInt(minInput.value) || 0;
            const s = parseInt(secInput.value) || 0;
            totalSeconds = (h * 3600) + (m * 60) + s;
        }

        if (totalSeconds <= 0) {
            alert("Please set a time greater than zero!");
            return;
        }

        // Unlocks audio for mobile/modern browsers
        audio.load();

        // UI State
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        statusDiv.classList.remove('hidden');
        isPaused = false;

        // The Ticker
        timerInterval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                timerFinished();
            } else {
                totalSeconds--;
                updateDisplay();
            }
        }, 1000);
    }

    // 5. Pause Logic
    function pauseTimer() {
        clearInterval(timerInterval);
        isPaused = true;
        pauseBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
        startBtn.textContent = "Resume";
    }

    // 6. Reset Logic
    function resetTimer() {
        clearInterval(timerInterval);
        audio.pause();
        audio.currentTime = 0;
        totalSeconds = 0;
        isPaused = false;
        
        // Reset Inputs & Display
        hrsInput.value = 0;
        minInput.value = 0;
        secInput.value = 0;
        updateDisplay();
        
        // Reset UI
        startBtn.classList.remove('hidden');
        startBtn.textContent = "Start";
        pauseBtn.classList.add('hidden');
        statusDiv.classList.add('hidden');
        document.querySelector('.tool-wrapper').classList.remove('alarm-ringing');
        
        document.getElementById('statusTitle').textContent = "Timer Active";
        document.getElementById('statusMsg').textContent = "Focus on your task!";
    }

    // 7. Finish Logic (Trigger Alarm)
    function timerFinished() {
        audio.play().catch(() => {
            console.log("Autoplay blocked - showing alert.");
            alert("⏰ Time's up!");
        });
        
        document.querySelector('.tool-wrapper').classList.add('alarm-ringing');
        document.getElementById('statusTitle').textContent = "Time's Up!";
        document.getElementById('statusMsg').textContent = "Click Reset to stop the alarm.";
    }

    // 8. Quick Preset Logic
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const totalMin = parseInt(button.dataset.minutes);
            
            // If timer is ringing or running, stop it
            resetTimer(); 

            const h = Math.floor(totalMin / 60);
            const m = totalMin % 60;

            hrsInput.value = h;
            minInput.value = m;
            secInput.value = 0;

            totalSeconds = (h * 3600) + (m * 60);
            updateDisplay();
        });
    });

    // 9. Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Initial Display Setup
    updateDisplay();
});