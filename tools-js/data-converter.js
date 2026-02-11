document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('dataInput');
    const output = document.getElementById('dataOutput');
    const tableContainer = document.getElementById('tableContainer');
    const previewSection = document.getElementById('previewSection');

    // --- 1. RECURSIVE LOGIC ---

    /**
     * Flattens a nested object into a single level using dot notation.
     * { user: { id: 1 } } -> { "user.id": 1 }
     */
    function flattenObject(obj, prefix = '') {
        return Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
                Object.assign(acc, flattenObject(obj[k], pre + k));
            } else {
                acc[pre + k] = obj[k];
            }
            return acc;
        }, {});
    }

    /**
     * Reconstructs a nested object from dot notation.
     * { "user.id": 1 } -> { user: { id: 1 } }
     */
    function unflattenObject(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (i === keys.length - 1) {
                current[key] = value;
            } else {
                current[key] = current[key] || {};
                current = current[key];
            }
        }
    }

    // --- 2. CONVERSION ENGINES ---

    function jsonToCsv(jsonArray) {
        try {
            let data = typeof jsonArray === 'string' ? JSON.parse(jsonArray) : jsonArray;
            if (!Array.isArray(data)) data = [data];
            
            const flattenedData = data.map(item => flattenObject(item));
            const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
            
            const csvRows = [
                headers.join(','),
                ...flattenedData.map(row => headers.map(fieldName => {
                    const value = row[fieldName] ?? '';
                    // Escape quotes and wrap in quotes to handle commas
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(','))
            ];
            
            renderPreview(headers, flattenedData);
            return csvRows.join('\n');
        } catch (e) {
            throw new Error("Invalid JSON structure.");
        }
    }

    function csvToJson(csvText) {
        const lines = csvText.trim().split(/\r?\n/);
        if (lines.length < 2) throw new Error("CSV must contain a header and at least one row.");

        // Split by comma but ignore commas inside double quotes
        const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
        const headers = lines[0].split(regex).map(h => h.replace(/^"|"$/g, '').trim());
        
        const result = lines.slice(1).map(line => {
            const values = line.split(regex).map(v => v.replace(/^"|"$/g, '').trim());
            let obj = {};
            
            headers.forEach((header, index) => {
                const value = values[index] ?? '';
                if (header.includes('.')) {
                    unflattenObject(obj, header, value);
                } else {
                    obj[header] = value;
                }
            });
            return obj;
        });

        // Update preview for CSV as well
        const flattenedForPreview = result.map(item => flattenObject(item));
        renderPreview(headers, flattenedForPreview);

        return JSON.stringify(result, null, 4);
    }

    // --- 3. UI RENDERING ---

    function renderPreview(headers, data) {
        previewSection.classList.remove('hidden');
        let html = '<table class="preview-table"><thead><tr>';
        headers.forEach(h => html += `<th>${h}</th>`);
        html += '</tr></thead><tbody>';
        
        // Show first 15 rows for preview
        data.slice(0, 15).forEach(row => {
            html += '<tr>';
            headers.forEach(h => {
                const val = row[h] ?? '';
                html += `<td>${val}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        tableContainer.innerHTML = html;
    }

    // --- 4. EVENT LISTENERS ---

    document.getElementById('jsonToCsvBtn').addEventListener('click', () => {
        if (!input.value.trim()) return;
        try {
            output.value = jsonToCsv(input.value);
        } catch (e) {
            alert(e.message);
        }
    });

    document.getElementById('csvToJsonBtn').addEventListener('click', () => {
        if (!input.value.trim()) return;
        try {
            output.value = csvToJson(input.value);
        } catch (e) {
            alert(e.message);
        }
    });
});