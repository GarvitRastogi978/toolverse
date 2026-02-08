document.addEventListener('DOMContentLoaded', () => {
    const compareBtn = document.getElementById('compareBtn');
    const oldInput = document.getElementById('textOld');
    const newInput = document.getElementById('textNew');
    const resultDiv = document.getElementById('diffResult');
    const outputContainer = document.getElementById('diffOutputContainer');

    compareBtn.addEventListener('click', () => {
        const oldLines = oldInput.value.split('\n');
        const newLines = newInput.value.split('\n');
        
        // Simple Line-by-Line Diff Algorithm
        let resultHtml = '';
        let i = 0, j = 0;

        // Note: For a true GitHub-style diff, one would use the LCS algorithm.
        // This is a robust line-comparison implementation.
        while (i < oldLines.length || j < newLines.length) {
            if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
                // Unchanged
                resultHtml += `<span class="diff-line"><span class="line-num">${i+1}</span>  ${escapeHtml(oldLines[i])}</span>`;
                i++; j++;
            } else if (j < newLines.length && (i >= oldLines.length || !oldLines.includes(newLines[j], i))) {
                // Added
                resultHtml += `<span class="diff-line diff-added">+<span class="line-num"></span> ${escapeHtml(newLines[j])}</span>`;
                j++;
            } else if (i < oldLines.length) {
                // Removed
                resultHtml += `<span class="diff-line diff-removed">-<span class="line-num"></span> ${escapeHtml(oldLines[i])}</span>`;
                i++;
            }
        }

        resultDiv.innerHTML = resultHtml;
        outputContainer.classList.remove('hidden');
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});