// Make modals available globally
window.openModal = function(id) { document.getElementById(id).style.display = 'block'; }
window.closeModals = function() { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); }

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputSize = document.getElementById('inputSize');
    const sizeLabel = document.getElementById('sizeLabel');
    const arrayContainer = document.getElementById('arrayContainer');
    const btnRandomize = document.getElementById('btnRandomizeTarget');
    const customTargetInput = document.getElementById('customTarget');
    const statusMessage = document.getElementById('statusMessage');
    
    // Buttons
    const btnClassical = document.getElementById('btnRunClassical');
    const btnStepClassical = document.getElementById('btnStepClassical');
    const btnNP = document.getElementById('btnRunNP');
    const btnStepNP = document.getElementById('btnStepNP');
    const btnQuantum = document.getElementById('btnRunQuantum');
    
    // Metrics & Progress
    const progClass = document.getElementById('progClassical');
    const progNp = document.getElementById('progNp');
    const progQuant = document.getElementById('progQuantum');
    
    const metricClassTime = document.getElementById('metricClassTime');
    const metricClassComps = document.getElementById('metricClassComps');
    const metricNpChecks = document.getElementById('metricNpChecks');
    const metricQuantIters = document.getElementById('metricQuantIters');
    
    const quantumCircuit = document.getElementById('quantumCircuitOverlay');

    // State
    let targetIndex = 25;
    let arraySize = 50;
    let isAnimating = false;
    let complexityChart = null;
    
    // Step state
    let stepMode = false;
    let currentStep = 0;
    let stepResolve = null;

    // Initialize
    init();

    function init() {
        updateArray();
        initChart();
        
        // Close modals on outside click
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) closeModals();
        }
    }

    // Event Listeners
    inputSize.addEventListener('input', (e) => {
        if(isAnimating) return;
        arraySize = parseInt(e.target.value);
        sizeLabel.textContent = arraySize;
        customTargetInput.max = arraySize - 1;
        if(targetIndex >= arraySize) {
            targetIndex = arraySize - 1;
            customTargetInput.value = targetIndex;
        }
        updateArray();
        updateChartHighlight();
    });

    customTargetInput.addEventListener('change', (e) => {
        if(isAnimating) return;
        let val = parseInt(e.target.value);
        if(isNaN(val) || val < 0) val = 0;
        if(val >= arraySize) val = arraySize - 1;
        targetIndex = val;
        e.target.value = val;
        updateArray();
    });

    btnRandomize.addEventListener('click', () => {
        if(isAnimating) return;
        targetIndex = Math.floor(Math.random() * arraySize);
        customTargetInput.value = targetIndex;
        updateArray();
    });

    // Run Handlers
    btnClassical.addEventListener('click', () => { stepMode = false; runSimulation('classical'); });
    btnStepClassical.addEventListener('click', () => { 
        if(!isAnimating) { stepMode = true; runSimulation('classical'); }
        else if(stepResolve) { stepResolve(); stepResolve = null; } // Advance step
    });
    
    btnNP.addEventListener('click', () => { stepMode = false; runSimulation('np'); });
    btnStepNP.addEventListener('click', () => {
        if(!isAnimating) { stepMode = true; runSimulation('np'); }
        else if(stepResolve) { stepResolve(); stepResolve = null; }
    });
    
    btnQuantum.addEventListener('click', () => runSimulation('quantum'));

    // Core Functions
    function updateArray() {
        arrayContainer.innerHTML = '';
        for (let i = 0; i < arraySize; i++) {
            const box = document.createElement('div');
            box.classList.add('array-box');
            box.id = `box-${i}`;
            // Optional: subtle preview of target
            if(i === targetIndex) box.classList.add('target-preview');
            arrayContainer.appendChild(box);
        }
        resetMetrics();
        statusMessage.textContent = 'System initialized. Ready for execution.';
        statusMessage.style.color = 'var(--color-success)';
    }

    function resetArrayColors() {
        const boxes = document.querySelectorAll('.array-box');
        boxes.forEach(box => {
            box.className = 'array-box';
            if(parseInt(box.id.split('-')[1]) === targetIndex) box.classList.add('target-preview');
        });
    }

    function resetMetrics() {
        metricClassTime.textContent = '0.00 ms'; metricClassComps.textContent = '0';
        metricNpChecks.textContent = '0'; metricQuantIters.textContent = '0';
        progClass.style.width = '0%'; progNp.style.width = '0%'; progQuant.style.width = '0%';
    }

    function disableControls(disabled) {
        inputSize.disabled = disabled;
        customTargetInput.disabled = disabled;
        btnRandomize.disabled = disabled;
        btnClassical.disabled = disabled;
        btnNP.disabled = disabled;
        btnQuantum.disabled = disabled;
        // Step buttons remain enabled if in step mode
        if(!stepMode) {
            btnStepClassical.disabled = disabled;
            btnStepNP.disabled = disabled;
        }
    }

    async function runSimulation(type) {
        if (isAnimating && !stepMode) return;
        isAnimating = true;
        disableControls(true);
        resetArrayColors();

        try {
            if (type === 'classical') await animateClassical();
            if (type === 'np') await animateNP();
            if (type === 'quantum') await animateQuantum();
        } catch (e) { console.error(e); }

        isAnimating = false;
        stepMode = false;
        stepResolve = null;
        disableControls(false);
    }

    // Wait helper
    function wait() {
        if(stepMode) {
            statusMessage.textContent = "Execution paused. Press 'Step' to advance.";
            return new Promise(r => stepResolve = r);
        }
        // Auto speed based on array size
        return new Promise(r => setTimeout(r, Math.max(10, 300 / arraySize)));
    }

    // ANIMATIONS
    async function animateClassical() {
        statusMessage.textContent = 'Executing Linear Search (O(n))...';
        statusMessage.style.color = 'var(--color-classical)';
        const start = performance.now();
        
        for (let i = 0; i < arraySize; i++) {
            const box = document.getElementById(`box-${i}`);
            box.classList.add('checking-classical');
            metricClassComps.textContent = (i + 1).toString();
            progClass.style.width = `${((i+1)/arraySize)*100}%`;
            
            if (i === targetIndex) {
                box.classList.remove('checking-classical');
                box.classList.add('found');
                const end = performance.now();
                metricClassTime.textContent = (end - start).toFixed(2) + ' ms';
                statusMessage.textContent = `TARGET ACQUIRED at index ${i}. Search space exhausted.`;
                return;
            }
            
            await wait();
            box.classList.remove('checking-classical');
        }
    }

    async function animateNP() {
        statusMessage.textContent = 'Initiating Brute-Force Sequence (O(2ⁿ))...';
        statusMessage.style.color = 'var(--color-np)';
        const boxes = document.querySelectorAll('.array-box');
        
        let paths = 0;
        const maxFlashes = stepMode ? arraySize : 30; // Shorter if auto
        
        for(let f=0; f < maxFlashes; f++) {
            // Chaotic visual
            boxes.forEach(box => box.classList.remove('checking-np'));
            let activeNodes = Math.min(arraySize, Math.floor(Math.random() * 20) + 5);
            for(let j=0; j<activeNodes; j++){
                let rnd = Math.floor(Math.random() * arraySize);
                document.getElementById(`box-${rnd}`).classList.add('checking-np');
            }
            
            paths += Math.floor(Math.random() * 1000000);
            metricNpChecks.textContent = paths.toLocaleString() + "++";
            progNp.style.width = `${((f+1)/maxFlashes)*100}%`;
            
            await wait();
        }
        
        boxes.forEach(box => box.classList.remove('checking-np'));
        const targetBox = document.getElementById(`box-${targetIndex}`);
        targetBox.classList.add('found');
        
        const trueComplexity = "2^" + arraySize;
        metricNpChecks.textContent = `Massive (${trueComplexity})`;
        statusMessage.textContent = `Brute-force halted. State space explosion simulated.`;
    }

    async function animateQuantum() {
        statusMessage.textContent = "Initializing Quantum Circuit...";
        statusMessage.style.color = 'var(--color-quantum)';
        
        // Show Circuit
        quantumCircuit.classList.remove('hidden');
        await new Promise(r => setTimeout(r, 1500));
        quantumCircuit.classList.add('hidden');
        
        statusMessage.textContent = "Applying Hadamard Gates (Superposition)...";
        const boxes = document.querySelectorAll('.array-box');
        boxes.forEach(box => box.classList.add('superposition'));
        
        await new Promise(r => setTimeout(r, 1000));
        
        statusMessage.textContent = "Oracle & Diffuser applied (Amplitude Amplification)...";
        await new Promise(r => setTimeout(r, 800));
        
        // Collapse
        boxes.forEach(box => box.classList.remove('superposition'));
        const targetBox = document.getElementById(`box-${targetIndex}`);
        targetBox.classList.add('quantum-target');
        
        const iters = Math.ceil((Math.PI / 4) * Math.sqrt(arraySize));
        metricQuantIters.textContent = iters;
        progQuant.style.width = '100%';
        
        statusMessage.textContent = `Superposition collapsed. Target isolated in ${iters} iterations (~√n).`;
    }

    // Chart.js Setup
    function initChart() {
        const ctx = document.getElementById('complexityChart').getContext('2d');
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Space Grotesk', sans-serif";
        
        complexityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [10, 50, 100, 250, 500],
                datasets: [
                    {
                        label: 'Classical O(n)',
                        data: [10, 50, 100, 250, 500],
                        borderColor: '#0ea5e9',
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    },
                    {
                        label: 'NP O(2ⁿ) (Scaled)',
                        data: [1024, 2500, 5000, 10000, 20000],
                        borderColor: '#ef4444',
                        borderDash: [5, 5],
                        tension: 0.4,
                        borderWidth: 2
                    },
                    {
                        label: 'Quantum O(√n)',
                        data: [3, 7, 10, 16, 22],
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168, 85, 247, 0.2)',
                        fill: true,
                        borderWidth: 4,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#f8fafc', font: { size: 14 } } },
                    tooltip: { mode: 'index', intersect: false }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false }
            }
        });
    }

    function updateChartHighlight() {
        // Logic to highlight the current 'n' on the chart could go here
        // For now, the chart acts as a static reference for O-notation
    }
});
