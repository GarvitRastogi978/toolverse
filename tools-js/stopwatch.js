document.addEventListener('DOMContentLoaded', () => {
    let startTime, elapsedTime = 0, timerInterval;

    const display = document.getElementById('stopwatchDisplay');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const lapBtn = document.getElementById('lapBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapsContainer = document.getElementById('lapsContainer');
    const lapsList = document.getElementById('lapsList');

    function timeToString(time) {
        let diffInHrs = time / 3600000;
        let hh = Math.floor(diffInHrs);

        let diffInMin = (diffInHrs - hh) * 60;
        let mm = Math.floor(diffInMin);

        let diffInSec = (diffInMin - mm) * 60;
        let ss = Math.floor(diffInSec);

        let diffInMs = (diffInSec - ss) * 100;
        let ms = Math.floor(diffInMs);

        let formattedMM = mm.toString().padStart(2, "0");
        let formattedSS = ss.toString().padStart(2, "0");
        let formattedMS = ms.toString().padStart(2, "0");

        return `${formattedMM}:${formattedSS}.${formattedMS}`;
    }

    function print(txt) {
        display.innerHTML = txt;
    }

    function start() {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(function printTime() {
            elapsedTime = Date.now() - startTime;
            print(timeToString(elapsedTime));
        }, 10);
        showButton("STOP");
    }

    function stop() {
        clearInterval(timerInterval);
        showButton("START");
    }

    function reset() {
        clearInterval(timerInterval);
        print("00:00.00");
        elapsedTime = 0;
        lapsList.innerHTML = "";
        lapsContainer.classList.add('hidden');
        showButton("START");
    }

    function lap() {
        lapsContainer.classList.remove('hidden');
        const li = document.createElement("li");
        li.innerHTML = `Lap ${lapsList.children.length + 1}: <strong>${timeToString(elapsedTime)}</strong>`;
        li.style.borderBottom = "1px solid #ddd";
        li.style.padding = "5px 0";
        lapsList.prepend(li);
    }

    function showButton(buttonKey) {
        if (buttonKey === "STOP") {
            startBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');
            lapBtn.classList.remove('hidden');
        } else {
            startBtn.classList.remove('hidden');
            stopBtn.classList.add('hidden');
            lapBtn.classList.add('hidden');
        }
    }

    startBtn.addEventListener("click", start);
    stopBtn.addEventListener("click", stop);
    resetBtn.addEventListener("click", reset);
    lapBtn.addEventListener("click", lap);
});

// ... existing variables ...
const downloadLapsBtn = document.getElementById('downloadLapsBtn');

// Add this function to your script
function downloadLaps() {
    const laps = document.querySelectorAll('#lapsList li');
    if (laps.length === 0) return;

    // Create the text content
    let content = "ToolVerse Stopwatch - Lap Data\n";
    content += "----------------------------\n";
    
    // We reverse the list because new laps are 'prepended' to the top in the UI
    const lapArray = Array.from(laps).reverse();
    lapArray.forEach((lap, index) => {
        content += `${lap.innerText}\n`;
    });

    content += "\nGenerated on: " + new Date().toLocaleString();

    // Create a Blob and a download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `stopwatch-laps-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add the listener
downloadLapsBtn.addEventListener('click', downloadLaps);