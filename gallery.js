// Gallery page JavaScript
let teasData = [];
let currentTimer = null;
let timerInterval = null;
let timeRemaining = 0;
let isPaused = false;

// Load tea data from JSON file
async function loadTeaData() {
    console.log('Loading tea data for gallery...');
    
    try {
        const response = await fetch('./teas.json');
        if (!response.ok) {
            throw new Error(`Failed to load tea data: ${response.status} ${response.statusText}`);
        }
        
        teasData = await response.json();
        console.log('Tea data loaded successfully:', teasData.length, 'teas found');
        
        // Hide loading and display content
        document.getElementById('loading').style.display = 'none';
        displayRecipeImages();
        displayTeas();
        
    } catch (error) {
        console.error('Error loading tea data:', error);
        document.getElementById('loading').innerHTML = '<p>Erreur lors du chargement des données</p>';
    }
}

// Display recipe images carousel
function displayRecipeImages() {
    const recipeImages = [
        'blueberry.png',
        'boba.png', 
        'honey.png',
        'ice.png',
        'lemon.png',
        'macha.png',
        'milk.png',
        'strawberry.png',
        'sugar.png',
        'tea0.png'
    ];
    
    const carouselTrack = document.getElementById('carousel-track');
    const recipesCarousel = document.getElementById('recipes-carousel');
    
    carouselTrack.innerHTML = '';
    
    // Créer deux copies des images pour une boucle infinie
    const allImages = [...recipeImages, ...recipeImages];
    
    allImages.forEach((imageName, index) => {
        const img = document.createElement('img');
        img.src = `./assets/images/recipes/${imageName}`;
        img.alt = `Recipe ${imageName.replace('.png', '')}`;
        img.className = 'recipe-image';
        img.onclick = () => {
            console.log(`Clicked on ${imageName}`);
        };
        
        carouselTrack.appendChild(img);
    });
    
    recipesCarousel.style.display = 'block';
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
        
        // Apply colors from tea-specific colors directly
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
    document.getElementById('gallery-label').style.display = 'block';
    teaGrid.style.display = 'grid';
}

// Open modal with tea details
function openModal(tea) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const modal = modalOverlay.querySelector('.modal');
    
    // Apply colors from tea-specific colors to modal
    if (tea.colors) {
        modal.style.setProperty('--modal-bg', tea.colors.background);
        modal.style.setProperty('--modal-border', tea.colors.border);
        modal.style.setProperty('--modal-border-dashed', tea.colors.borderDashed);
        modal.style.setProperty('--modal-shadow1', tea.colors.shadow1);
        modal.style.setProperty('--modal-shadow2', tea.colors.shadow2);
        modal.style.setProperty('--modal-title', tea.colors.title);
        modal.style.setProperty('--modal-title-shadow', tea.colors.titleShadow);
        modal.style.setProperty('--modal-subtitle', tea.colors.description);
        modal.style.setProperty('--modal-details-bg', tea.colors.backgroundHover);
        modal.style.setProperty('--modal-details-border', tea.colors.borderDashed);
        modal.style.setProperty('--modal-details-text', tea.colors.title);
        modal.style.setProperty('--modal-details-bold', tea.colors.border);
        modal.style.setProperty('--modal-close-bg', tea.colors.badgeBackground);
        modal.style.setProperty('--modal-close-border', tea.colors.badgeBorder);
        modal.style.setProperty('--modal-close-text', tea.colors.badgeText);
        modal.style.setProperty('--modal-close-hover', tea.colors.border);
        modal.style.setProperty('--modal-timer-bg', tea.colors.border);
        modal.style.setProperty('--modal-timer-border', tea.colors.shadow2);
        modal.style.setProperty('--modal-timer-text', tea.colors.badgeText);
        modal.style.setProperty('--modal-timer-shadow', tea.colors.shadow2);
        modal.style.setProperty('--modal-timer-display-bg', tea.colors.background);
        modal.style.setProperty('--modal-timer-display-text', tea.colors.title);
        modal.style.setProperty('--modal-timer-display-border', tea.colors.shadow2);
        modal.style.setProperty('--modal-timer-display-shadow', tea.colors.shadow2);
        modal.style.setProperty('--modal-btn-bg', tea.colors.background);
        modal.style.setProperty('--modal-btn-border', tea.colors.shadow2);
        modal.style.setProperty('--modal-btn-text', tea.colors.title);
        modal.style.setProperty('--modal-btn-hover', tea.colors.borderDashed);
        modal.style.setProperty('--modal-btn-shadow', tea.colors.shadow2);
        
        // Apply colors to recipe button specifically
        modal.style.setProperty('--modal-badge-bg', tea.colors.badgeBackground);
        modal.style.setProperty('--modal-badge-border', tea.colors.badgeBorder);
        modal.style.setProperty('--modal-badge-text', tea.colors.badgeText);
        modal.style.setProperty('--modal-badge-shadow', tea.colors.shadow2);
        modal.style.setProperty('--modal-text', tea.colors.title);
    }
    
    modalContent.innerHTML = `
        <h2>${tea.name}</h2>
        <div class="recipe-section">
            <h3>Description</h3>
            <div class="recipe-details">
                <p>${tea.description}</p>
            </div>
        </div>
        <div class="recipe-section">
            <h3>Instructions</h3>
            <div class="recipe-details">
                <p><strong>Température:</strong> ${tea.temperature}</p>
                <p><strong>Temps d'infusion:</strong> ${formatTime(tea.steepingTimeSeconds)}</p>
                ${tea.ingredients ? `<p><strong>Ingrédients:</strong> ${tea.ingredients}</p>` : ''}
            </div>
        </div>
        <div class="timer-section">
            <h3>Minuteur de thé</h3>
            <div class="timer-display" id="timer-display">${formatTime(tea.steepingTimeSeconds)}</div>
            <div class="timer-controls">
                <button class="timer-btn start" onclick="startTimer(${tea.steepingTimeSeconds})">Start</button>
                <button class="timer-btn pause" onclick="pauseTimer()">Pause</button>
                <button class="timer-btn reset" onclick="resetTimer(${tea.steepingTimeSeconds})">Reset</button>
            </div>
            ${tea.recipe ? `
            <div class="recipe-discovery" style="margin-top: 1.5rem; text-align: center;">
                <button class="recipe-button" onclick="openRecipePage('${tea.name}')">Découvrir la recette</button>
            </div>
            ` : ''}
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

// Format time display
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Open recipe page
function openRecipePage(teaName) {
    const recipeUrl = `recipe.html?tea=${encodeURIComponent(teaName)}`;
    window.location.href = recipeUrl;
}

// Timer functions
function startTimer(duration) {
    if (isPaused) {
        isPaused = false;
    } else {
        timeRemaining = duration;
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    const timerDisplay = document.getElementById('timer-display');
    
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = 'Fini!';
            // Optional: play sound or show notification
            return;
        }
        
        timeRemaining--;
        timerDisplay.textContent = formatTime(timeRemaining);
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
    isPaused = false;
    timeRemaining = duration;
    document.getElementById('timer-display').textContent = formatTime(duration);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Gallery page loaded');
    loadTeaData();
});

// Close modal when clicking overlay
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});
