document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('queryInput');
    const runBtn = document.getElementById('runBtn');
    const statusText = document.getElementById('statusText');

    const resultsArea = document.getElementById('resultsArea');
    const toolOutput = document.getElementById('toolOutput');
    const assistantOutput = document.getElementById('assistantOutput');

    const errorArea = document.getElementById('errorArea');
    const errorOutput = document.getElementById('errorOutput');

    // Click handler for hints
    document.querySelectorAll('.hints li').forEach(li => {
        li.addEventListener('click', () => {
            queryInput.value = li.innerText.replace(/^"|"$/g, '');
        });
    });

    runBtn.addEventListener('click', async () => {
        const query = queryInput.value.trim();

        if (!query) {
            alert('Please enter a query first.');
            return;
        }

        // Reset UI
        resultsArea.classList.add('hidden');
        errorArea.classList.add('hidden');
        statusText.classList.remove('hidden');
        runBtn.disabled = true;
        runBtn.textContent = 'Running...';

        try {
            const response = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Server Error');
            }

            // Success Display
            toolOutput.textContent = JSON.stringify(data.toolDecision, null, 2);
            assistantOutput.textContent = JSON.stringify(data.result, null, 2);
            resultsArea.classList.remove('hidden');

        } catch (err) {
            console.error(err);
            errorOutput.textContent = err.message;
            errorArea.classList.remove('hidden');
        } finally {
            runBtn.disabled = false;
            runBtn.textContent = 'Run Query';
            statusText.classList.add('hidden');
        }
    });
});
