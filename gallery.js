// Gallery page JavaScript
let teasData = [];
let colorPalettes = {};
let currentTimer = null;
let timerInterval = null;
let timeRemaining = 0;
let isPaused = false;

// Load color palettes from JSON file
async function loadColorPalettes() {
    try {
        const response = await fetch('./color-palettes.json');
        if (!response.ok) {
            throw new Error(`Failed to load color palettes: ${response.status} ${response.statusText}`);
        }
        
        colorPalettes = await response.json();
        console.log('Color palettes loaded successfully:', Object.keys(colorPalettes).length, 'palettes found');
        
    } catch (error) {
        console.error('Error loading color palettes:', error);
    }
}

// Load tea data from JSON file
async function loadTeaData() {
    console.log('Loading tea data for gallery...');
    
    try {
        // Load color palettes first
        await loadColorPalettes();
        
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
        
        // Apply colors from color palette
        if (tea.colorPalette && colorPalettes[tea.colorPalette]) {
            const palette = colorPalettes[tea.colorPalette];
            teaCard.style.setProperty('--card-bg', palette.background);
            teaCard.style.setProperty('--card-bg-hover', palette.backgroundHover);
            teaCard.style.setProperty('--card-border', palette.border);
            teaCard.style.setProperty('--card-border-dashed', palette.borderDashed);
            teaCard.style.setProperty('--card-shadow1', palette.shadow1);
            teaCard.style.setProperty('--card-shadow2', palette.shadow2);
            teaCard.style.setProperty('--card-title', palette.title);
            teaCard.style.setProperty('--card-title-shadow', palette.titleShadow);
            teaCard.style.setProperty('--card-description', palette.description);
            teaCard.style.setProperty('--card-badge-bg', palette.badgeBackground);
            teaCard.style.setProperty('--card-badge-text', palette.badgeText);
            teaCard.style.setProperty('--card-badge-border', palette.badgeBorder);
            teaCard.style.setProperty('--card-badge-shadow', palette.badgeShadow);
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
    
    // Apply colors from color palette to modal
    if (tea.colorPalette && colorPalettes[tea.colorPalette]) {
        const palette = colorPalettes[tea.colorPalette];
        modal.style.setProperty('--modal-bg', palette.background);
        modal.style.setProperty('--modal-border', palette.border);
        modal.style.setProperty('--modal-border-dashed', palette.borderDashed);
        modal.style.setProperty('--modal-shadow1', palette.shadow1);
        modal.style.setProperty('--modal-shadow2', palette.shadow2);
        modal.style.setProperty('--modal-title', palette.title);
        modal.style.setProperty('--modal-title-shadow', palette.titleShadow);
        modal.style.setProperty('--modal-subtitle', palette.description);
        modal.style.setProperty('--modal-details-bg', palette.backgroundHover);
        modal.style.setProperty('--modal-details-border', palette.borderDashed);
        modal.style.setProperty('--modal-details-text', palette.title);
        modal.style.setProperty('--modal-details-bold', palette.border);
        modal.style.setProperty('--modal-close-bg', palette.badgeBackground);
        modal.style.setProperty('--modal-close-border', palette.badgeBorder);
        modal.style.setProperty('--modal-close-text', palette.badgeText);
        modal.style.setProperty('--modal-close-hover', palette.border);
        modal.style.setProperty('--modal-timer-bg', palette.border);
        modal.style.setProperty('--modal-timer-border', palette.shadow2);
        modal.style.setProperty('--modal-timer-text', palette.badgeText);
        modal.style.setProperty('--modal-timer-shadow', palette.shadow2);
        modal.style.setProperty('--modal-timer-display-bg', palette.background);
        modal.style.setProperty('--modal-timer-display-text', palette.title);
        modal.style.setProperty('--modal-timer-display-border', palette.shadow2);
        modal.style.setProperty('--modal-timer-display-shadow', palette.shadow2);
        modal.style.setProperty('--modal-btn-bg', palette.background);
        modal.style.setProperty('--modal-btn-border', palette.shadow2);
        modal.style.setProperty('--modal-btn-text', palette.title);
        modal.style.setProperty('--modal-btn-hover', palette.borderDashed);
        modal.style.setProperty('--modal-btn-shadow', palette.shadow2);
        
        // Apply colors to recipe button specifically
        modal.style.setProperty('--modal-badge-bg', palette.badgeBackground);
        modal.style.setProperty('--modal-badge-border', palette.badgeBorder);
        modal.style.setProperty('--modal-badge-text', palette.badgeText);
        modal.style.setProperty('--modal-badge-shadow', palette.shadow2);
        modal.style.setProperty('--modal-text', palette.title);
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
