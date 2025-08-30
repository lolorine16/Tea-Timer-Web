
// Global variables
let teasData = [];
let currentTimer = null;
let timerInterval = null;
let timeRemaining = 0;
let isPaused = false;
let appInitialized = false;
let welcomeShown = false;

// Simple test function
function testJsonLoad() {
    console.log('=== USING STATIC TEST DATA ===');
    
    // Test avec des données statiques d'abord
    teasData = [
        {
            "name": "ICE TEA TEST",
            "description": "Un mélange rafraîchissant de thé noir, d'agrumes et d'une pointe de menthe.",
            "temperature": "Servir froid",
            "steepingTimeSeconds": 240,
            "ingredients": "Thé noir, citron, orange, menthe",
            "image": "./assets/images/IceTea.png",
            "colorPalette": "orange-palette"
        }
    ];
    
    colorPalettes = {
        "orange-palette": {
            "background": "#f0f5dc",
            "backgroundHover": "#f0f5dc", 
            "border": "#d87f5c",
            "borderDashed": "#f0b886",
            "shadow1": "#f0b886",
            "shadow2": "#8b3e34",
            "title": "#8b3e34",
            "titleShadow": "#f0b886",
            "description": "#d87f5c",
            "badgeBackground": "#f0933b",
            "badgeText": "#f0f5dc",
            "badgeBorder": "#d87f5c",
            "badgeShadow": "#8b3e34"
        }
    };
    
    console.log('Using static data for now...');
    
    // Hide loading and display welcome section first
    document.getElementById('loading').style.display = 'none';
    displayWelcomeSection();
}

// Load tea data from JSON file
async function loadTeaData() {
    console.log('Starting to load tea data...');
    console.log('Current URL:', window.location.href);
    
    try {
        console.log('Fetching teas.json...');
        const response = await fetch('./teas.json');
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Failed to load tea data: ${response.status} ${response.statusText}`);
        }
        
        console.log('Parsing JSON...');
        const text = await response.text();
        console.log('Raw response text length:', text.length);
        
        teasData = JSON.parse(text);
        console.log('Tea data loaded successfully:', teasData.length, 'teas found');
        
        // Hide loading and display welcome section first
        document.getElementById('loading').style.display = 'none';
        displayWelcomeSection();
        
    } catch (error) {
        console.error('Error loading tea data:', error);
        console.error('Error details:', error.message);
        console.log('Falling back to static data...');
        
        // Utiliser testJsonLoad comme fallback
        testJsonLoad();
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
            // Optional: Add click functionality here
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

// Open modal with tea details (popup du the pour voir les details)
function openModal(tea) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const modal = modalOverlay.querySelector('.modal');
    
    // Apply colors from tea-specific colors to modal (Ajouter des couleurs au popup)
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

// Open recipe page
function openRecipePage(teaName) {
    const recipeUrl = `recipe.html?tea=${encodeURIComponent(teaName)}`;
    window.location.href = recipeUrl;
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
            alert("🍵 Votre thé est prêt ! Savourez-le bien !"); //notification apres le temps ecoule
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

// Typing effect function
function typeMessage(text, elementId, speed = 50) {
    const element = document.getElementById(elementId);
    element.textContent = '';
    let i = 0;
    
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    }
    
    typeChar();
}

// Display welcome section with typing effect
function displayWelcomeSection() {
    if (welcomeShown) {
        return; // Éviter les appels multiples
    }
    
    welcomeShown = true;
    const welcomeSection = document.getElementById('welcome-section');
    welcomeSection.style.display = 'block';
    
    // Start typing effect after a short delay
    setTimeout(() => {
        const message = "Bienvenue ! Moi c'est Laureen, amatrice de thé ! Merci de visiter Tea Timer, passez un bon moment de détente.";
        typeMessage(message, 'typing-message', 80);
        
        // Afficher les autres sections après que le message soit terminé
        setTimeout(() => {
            showMainContent();
        }, message.length * 80 + 1000); // Durée du message + 1 seconde
        
    }, 500);
}

// Afficher le contenu principal (carrousel et cartes)
function showMainContent() {
    if (appInitialized) {
        return; // Éviter les appels multiples
    }
    
    appInitialized = true;
    console.log('Showing main content...');
    
    displayRecipeImages();
    displayTeas();
}

// Event Listeners

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    loadTeaData();
    
    // Check if we should open a specific tea timer from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const openTimerTea = urlParams.get('openTimer');
    if (openTimerTea) {
        // Wait for data to load, then open the modal
        setTimeout(() => {
            const tea = teasData.find(t => t.name === decodeURIComponent(openTimerTea));
            if (tea) {
                openModal(tea);
            }
        }, 1000);
    }
    
    // Set up modal event listeners
    const modalOverlay = document.getElementById('modal-overlay');
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) {
                closeModal();
            }
        }
    });
});