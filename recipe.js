// Recipe page JavaScript
let currentTea = null;

// Load tea data and display recipe
async function loadRecipe() {
    // Get tea name from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const teaName = urlParams.get('tea');
    
    if (!teaName) {
        console.error('No tea specified in URL');
        goHome();
        return;
    }
    
    try {
        const response = await fetch('./teas.json');
        if (!response.ok) {
            throw new Error('Failed to load tea data');
        }
        
        const teasData = await response.json();
        currentTea = teasData.find(tea => tea.name === decodeURIComponent(teaName));
        
        if (!currentTea || !currentTea.recipe) {
            console.error('Tea not found or no recipe available:', teaName);
            goHome();
            return;
        }
        
        displayRecipe(currentTea);
        applyThemeColors(currentTea);
        
    } catch (error) {
        console.error('Error loading recipe:', error);
        goHome();
    }
}

// Display recipe content
function displayRecipe(tea) {
    // Set page title
    document.getElementById('recipe-title').textContent = `Recette ${tea.name} - Tea Timer`;
    document.getElementById('recipe-name').textContent = `Recette ${tea.name}`;
    
    // Set image
    const recipeImage = document.getElementById('recipe-image');
    recipeImage.src = tea.image;
    recipeImage.alt = tea.name;
    
    // Set description
    document.getElementById('recipe-description').textContent = tea.description;
    
    // Set meta information
    const metaContainer = document.getElementById('recipe-meta');
    metaContainer.innerHTML = `
        <div class="meta-item">
            <div class="meta-label">Portions</div>
            <div class="meta-value">${tea.recipe.servingSize}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">Difficulté</div>
            <div class="meta-value">${tea.recipe.difficulty}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">Temps total</div>
            <div class="meta-value">${tea.recipe.totalTime}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">Température</div>
            <div class="meta-value">${tea.temperature}</div>
        </div>
    `;
    
    // Set preparation steps
    const stepsContainer = document.getElementById('recipe-steps');
    stepsContainer.innerHTML = tea.recipe.preparationSteps
        .map(step => `<li>${step}</li>`)
        .join('');
    
    // Set tips
    const tipsContainer = document.getElementById('recipe-tips');
    tipsContainer.innerHTML = tea.recipe.tips
        .map(tip => `<li>${tip}</li>`)
        .join('');
    
    // Set benefits
    const benefitsContainer = document.getElementById('recipe-benefits');
    benefitsContainer.innerHTML = tea.recipe.benefits
        .map(benefit => `<li>${benefit}</li>`)
        .join('');
}

// Apply theme colors based on tea's specific colors
function applyThemeColors(tea) {
    if (tea.colors) {
        const root = document.documentElement;
        
        // Apply color variables to root
        root.style.setProperty('--recipe-primary', tea.colors.title);
        root.style.setProperty('--recipe-primary-light', tea.colors.titleShadow);
        root.style.setProperty('--recipe-secondary', tea.colors.border);
        root.style.setProperty('--recipe-background', tea.colors.background);
        root.style.setProperty('--recipe-card-bg', tea.colors.backgroundHover);
        root.style.setProperty('--recipe-border', tea.colors.borderDashed);
        root.style.setProperty('--recipe-accent', tea.colors.badgeBackground);
        root.style.setProperty('--recipe-accent-text', tea.colors.badgeText);
        root.style.setProperty('--recipe-shadow', tea.colors.shadow1);
        root.style.setProperty('--recipe-shadow-dark', tea.colors.shadow2);
    }
}

// Navigation functions
function goBack() {
    window.history.back();
}

function goBackToTimer() {
    if (currentTea) {
        // Go back to main page and open timer modal
        const mainUrl = `./index.html?openTimer=${encodeURIComponent(currentTea.name)}`;
        window.location.href = mainUrl;
    } else {
        goHome();
    }
}

function goHome() {
    window.location.href = './index.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadRecipe();
});
