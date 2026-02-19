document.addEventListener('DOMContentLoaded', () => {
    const hrWrap = document.getElementById('hr-wrapper');
    const mnWrap = document.getElementById('mn-wrapper');
    const scWrap = document.getElementById('sc-wrapper');
    const digitalDisplay = document.getElementById('digitalTime');
    const tzSelect = document.getElementById('timezoneSelect');

    function updateClock() {
        const now = new Date();
        const selectedTz = tzSelect.value;

        // Get time based on timezone
        const timeString = now.toLocaleTimeString('en-US', {
            timeZone: selectedTz === 'local' ? undefined : selectedTz,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const [h, m, s] = timeString.split(':').map(Number);

        // Calculate Degrees
        const scDeg = s * 6;
        const mnDeg = m * 6 + (s / 60) * 6;
        const hrDeg = (h % 12) * 30 + (m / 60) * 30;

        // Apply Rotation to the Wrappers
        scWrap.style.transform = `rotate(${scDeg}deg)`;
        mnWrap.style.transform = `rotate(${mnDeg}deg)`;
        hrWrap.style.transform = `rotate(${hrDeg}deg)`;

        // Update Digital Text
        digitalDisplay.textContent = timeString;
    }

    // Update every second
    setInterval(updateClock, 1000);
    
    // Immediate call so there is no 1-second delay on load
    updateClock();

    // Listen for timezone changes
    tzSelect.addEventListener('change', updateClock);
});