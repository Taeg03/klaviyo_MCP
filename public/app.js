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

            // Handle Personalization
            const resultCard = assistantOutput.closest('.card');
            // Remove any existing variant list first
            resultCard.querySelectorAll('.variants-list').forEach(el => el.remove());

            if (data.result && data.result.personalizedVariants && data.result.personalizedVariants.length > 0) {
                const variantsDiv = document.createElement('div');
                variantsDiv.className = 'variants-list';
                variantsDiv.style.marginTop = '24px';
                variantsDiv.style.borderTop = '1px solid #ebecf0';
                variantsDiv.style.paddingTop = '16px';

                variantsDiv.innerHTML = `<h4>Personalized Variants (${data.result.personalizedVariants.length})</h4>`;

                data.result.personalizedVariants.forEach(variant => {
                    const item = document.createElement('div');
                    item.style.background = '#f4f5f7';
                    item.style.padding = '12px';
                    item.style.marginTop = '12px';
                    item.style.borderRadius = '4px';
                    item.style.border = '1px solid #dfe1e6';

                    item.innerHTML = `
                        <div style="font-weight: 600; font-size: 13px; color: #42526e; margin-bottom: 4px;">
                            To: ${variant.name} (${variant.email})
                        </div>
                        <div style="font-weight: 700; color: #172b4d; margin-bottom: 4px;">
                            ${variant.subjectLine}
                        </div>
                        <div style="white-space: pre-wrap; font-size: 13px; color: #172b4d; margin-bottom: 8px;">${variant.body}</div>
                        ${variant.rationale ? `<div style="font-size: 11px; color: #6b778c; font-style: italic;">Rationale: ${variant.rationale}</div>` : ''}
                    `;
                    variantsDiv.appendChild(item);
                });

                resultCard.appendChild(variantsDiv);
            }

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
