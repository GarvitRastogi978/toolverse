const synth = window.speechSynthesis;
const ttsInput = document.getElementById('ttsInput');
const ttsVoice = document.getElementById('ttsVoice');
const ttsRate = document.getElementById('ttsRate');
const ttsRateLabel = document.getElementById('ttsRateLabel');
const ttsSpeakBtn = document.getElementById('ttsSpeakBtn');
const ttsClearBtn = document.getElementById('ttsClearBtn');

let voices = [];

function loadVoices() {
    voices = synth.getVoices();
    if (voices.length === 0) return;

    ttsVoice.innerHTML = voices
        .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
        .join('');
}

// Chrome/Edge fix for loading voices
loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

// Update Speed Label
ttsRate.oninput = () => {
    ttsRateLabel.textContent = ttsRate.value + 'x';
};

// SPEAK BUTTON
ttsSpeakBtn.onclick = (e) => {
    e.preventDefault();

    if (synth.speaking) {
        synth.cancel();
        updateButtonUI(false);
        return;
    }

    const text = ttsInput.value.trim();
    if (text !== "") {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find selected voice
        const selectedVoiceName = ttsVoice.value;
        utterance.voice = voices.find(v => v.name === selectedVoiceName);
        
        // Apply speed
        utterance.rate = parseFloat(ttsRate.rate || ttsRate.value); 

        utterance.onstart = () => updateButtonUI(true);
        utterance.onend = () => updateButtonUI(false);
        utterance.onerror = () => updateButtonUI(false);

        synth.speak(utterance);
    }
};

function updateButtonUI(isSpeaking) {
    if (isSpeaking) {
        ttsSpeakBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
        ttsSpeakBtn.style.backgroundColor = '#ffcccc';
    } else {
        ttsSpeakBtn.innerHTML = '<i class="fa-solid fa-play"></i> Listen Now';
        ttsSpeakBtn.style.backgroundColor = '#c9e9d1';
    }
}

ttsClearBtn.onclick = () => {
    ttsInput.value = "";
    synth.cancel();
    updateButtonUI(false);
};