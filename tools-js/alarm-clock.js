// 1. GLOBAL SCOPE: Defined outside so all functions can see 'audio'
// This fixes the "audio is not defined" error
const audio = new Audio('../assets/sound/alarm-tone.mp3');
audio.loop = true;
let alarmTime = null;

document.addEventListener('DOMContentLoaded', () => {
    // 2. Element Selectors
    const currentTimeDisplay = document.getElementById('currentTime');
    const alarmTimeInput = document.getElementById('alarmTime');
    const setAlarmBtn = document.getElementById('setAlarmBtn');
    const clearAlarmBtn = document.getElementById('clearAlarmBtn');
    const alarmStatus = document.getElementById('alarmStatus');
    const statusText = document.getElementById('statusText');

    // 3. Clock Update Logic
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timeString = `${hours}:${minutes}:${seconds}`;
        currentTimeDisplay.textContent = timeString;

        // Trigger alarm when current time matches set time (HH:mm:00)
        if (alarmTime === timeString) {
            triggerAlarm();
        }
    }

    // 4. Trigger Alarm Logic
    function triggerAlarm() {
        // Log to console for debugging
        console.log("Attempting to play alarm...");

        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Audio playing successfully.");
            }).catch(error => {
                console.error("Autoplay prevented. Showing fallback alert.", error);
                // Fallback: An alert is a user interaction that "wakes up" the audio
                alert("⏰ ALARM: Time is up!");
                audio.play(); 
            });
        }
        
        document.querySelector('.tool-wrapper').classList.add('alarm-ringing');
        statusText.textContent = "⏰ Time's up! Alarm ringing...";
    }

    // 5. Button Event Listeners
    setAlarmBtn.addEventListener('click', () => {
        if (alarmTimeInput.value) {
            // Append :00 to match the timeString format
            alarmTime = alarmTimeInput.value + ":00";
            
            statusText.textContent = `Alarm set for ${alarmTimeInput.value}`;
            alarmStatus.classList.remove('hidden');
            clearAlarmBtn.classList.remove('hidden');
            setAlarmBtn.disabled = true;

            // CRITICAL: This "unlocks" the audio context for the browser
            audio.load(); 
            console.log("Audio primed and ready for: " + alarmTime);
        } else {
            alert("Please select a valid time.");
        }
    });

    clearAlarmBtn.addEventListener('click', () => {
        alarmTime = null;
        audio.pause();
        audio.currentTime = 0; // Reset sound to beginning
        document.querySelector('.tool-wrapper').classList.remove('alarm-ringing');
        
        alarmStatus.classList.add('hidden');
        clearAlarmBtn.classList.add('hidden');
        setAlarmBtn.disabled = false;
        alarmTimeInput.value = '';
        console.log("Alarm cleared.");
    });

    // Start the clock
    setInterval(updateClock, 1000);
    updateClock(); 
});