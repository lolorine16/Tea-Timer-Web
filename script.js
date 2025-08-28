
// Global variables
let teasData = [];
let currentTimer = null;
let timerInterval = null;
let timeRemaining = 0;
let isPaused = false;

// Load tea data from JSON file
async function loadTeaData() {
    try {
        const response = await fetch('teas.json');
        if (!response.ok) {
            throw new Error('Failed to load tea data');
        }
        teasData = await response.json();
        displayTeas();
    } catch (error) {
        console.error('Error loading tea data:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
    }
}

// Display tea cards
function displayTeas() {
    const teaGrid = document.getElementById('tea-grid');
    const loading = document.getElementById('loading');
    
    teaGrid.innerHTML = '';
    
    teasData.forEach((tea, index) => {
        const teaCard = document.createElement('div');
        teaCard.className = 'tea-card';
        teaCard.onclick = () => openModal(tea);
        
        // Apply custom colors if available
        if (tea.colors) {
            teaCard.style.setProperty('--card-bg', tea.colors.background);
            teaCard.style.setProperty('--card-bg-hover', tea.colors.backgroundHover);
            teaCard.style.setProperty('--card-border', tea.colors.border);
            teaCard.style.setProperty('--card-border-dashed', tea.colors.borderDashed);
            teaCard.style.setProperty('--card-shadow1', tea.colors.shadow1);
            teaCard.style.setProperty('--card-shadow2', tea.colors.shadow2);
            teaCard.style.setProperty('--card-title', tea.colors.title);
            teaCard.style.setProperty('--card-title-shadow', tea.colors.titleShadow);
            teaCard.style.setProperty('--card-description', tea.colors.description);
            teaCard.style.setProperty('--card-badge-bg', tea.colors.badgeBackground);
            teaCard.style.setProperty('--card-badge-text', tea.colors.badgeText);
            teaCard.style.setProperty('--card-badge-border', tea.colors.badgeBorder);
            teaCard.style.setProperty('--card-badge-shadow', tea.colors.badgeShadow);
        }
        
        teaCard.innerHTML = `
            ${tea.image ? `<img src="${tea.image}" alt="${tea.name}" class="tea-image">` : ''}
            <h3 class="tea-name">${tea.name}</h3>
            <p class="tea-preview">${tea.description.substring(0, 100)}...</p>
            <span class="steeping-time">${formatTime(tea.steepingTimeSeconds)}</span>
        `;
        
        teaGrid.appendChild(teaCard);
    });
    
    loading.style.display = 'none';
    teaGrid.style.display = 'grid';
}

// Open modal with tea details
function openModal(tea) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <h2>${tea.name}</h2>
        <div class="recipe-section">
            <h3>Description</h3>
            <div class="recipe-details">
                <p>${tea.description}</p>
            </div>
        </div>
        <div class="recipe-section">
            <h3>Brewing Instructions</h3>
            <div class="recipe-details">
                <p><strong>Temperature:</strong> ${tea.temperature}</p>
                <p><strong>Steeping Time:</strong> ${formatTime(tea.steepingTimeSeconds)}</p>
                ${tea.ingredients ? `<p><strong>Ingredients:</strong> ${tea.ingredients}</p>` : ''}
            </div>
        </div>
        <div class="timer-section">
            <h3>Steeping Timer</h3>
            <div class="timer-display" id="timer-display">${formatTime(tea.steepingTimeSeconds)}</div>
            <div class="timer-controls">
                <button class="timer-btn start" onclick="startTimer(${tea.steepingTimeSeconds})">Start</button>
                <button class="timer-btn pause" onclick="pauseTimer()">Pause</button>
                <button class="timer-btn reset" onclick="resetTimer(${tea.steepingTimeSeconds})">Reset</button>
            </div>
        </div>
    `;
    
    // Set initial timer values
    timeRemaining = tea.steepingTimeSeconds;
    currentTimer = tea.steepingTimeSeconds;
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isPaused = false;
}

// Timer functions
function startTimer(duration) {
    if (isPaused) {
        // Resume from paused state
        isPaused = false;
    } else {
        // Start fresh
        timeRemaining = duration;
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById('timer-display').textContent = "00:00";
            alert("🍵 Your tea is ready! Time to enjoy your perfect brew.");
            return;
        }
        
        timeRemaining--;
        document.getElementById('timer-display').textContent = formatTime(timeRemaining);
    }, 1000);
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
    }
}

function resetTimer(duration) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timeRemaining = duration;
    isPaused = false;
    document.getElementById('timer-display').textContent = formatTime(duration);
}

// Utility function to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Event Listeners

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modal-overlay');
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Initialize app
    loadTeaData();
});