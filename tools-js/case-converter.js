document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const copyFeedback = document.getElementById('copyFeedback');

    // Update stats (Words/Chars)
    function updateStats() {
        const text = textInput.value.trim();
        wordCount.textContent = text ? text.split(/\s+/).length : 0;
        charCount.textContent = textInput.value.length;
    }

    textInput.addEventListener('input', updateStats);

    // Transformation Functions
    document.getElementById('upperBtn').addEventListener('click', () => {
        textInput.value = textInput.value.toUpperCase();
        updateStats();
    });

    document.getElementById('lowerBtn').addEventListener('click', () => {
        textInput.value = textInput.value.toLowerCase();
        updateStats();
    });

    document.getElementById('sentenceBtn').addEventListener('click', () => {
        let text = textInput.value.toLowerCase();
        textInput.value = text.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        updateStats();
    });

    document.getElementById('titleBtn').addEventListener('click', () => {
        let text = textInput.value.toLowerCase();
        textInput.value = text.replace(/\b\w/g, c => c.toUpperCase());
        updateStats();
    });

    document.getElementById('capitalizeBtn').addEventListener('click', () => {
        let text = textInput.value.toLowerCase();
        textInput.value = text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        updateStats();
    });

    // Utilities
    document.getElementById('clearTextBtn').addEventListener('click', () => {
        textInput.value = '';
        updateStats();
    });

    document.getElementById('copyTextBtn').addEventListener('click', () => {
        if (!textInput.value) return;
        
        navigator.clipboard.writeText(textInput.value).then(() => {
            copyFeedback.classList.remove('hidden');
            setTimeout(() => copyFeedback.classList.add('hidden'), 2000);
        });
    });
});