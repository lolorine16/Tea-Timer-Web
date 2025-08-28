// Animation de feuilles qui tombent
class FallingLeavesAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.leaves = [];
        this.animationId = null;
        this.leafImage = new Image();
        this.isImageLoaded = false;
        
        // Paramètres de l'animation
        this.maxLeaves = 15;
        this.windStrength = 0.5;
        
        this.init();
    }
    
    init() {
        // Créer le canvas pour l'animation
        this.createCanvas();
        
        // Charger l'image des feuilles
        this.leafImage.onload = () => {
            this.isImageLoaded = true;
            this.createLeaves();
            this.animate();
        };
        this.leafImage.src = './assets/images/grass.png'; // Utilisation de l'image disponible
        
        // Ajouter des événements
        window.addEventListener('resize', () => this.handleResize());
    }
    
    createCanvas() {
        // Créer le canvas s'il n'existe pas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'falling-leaves-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.7';
        
        // Définir la taille du canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Ajouter le canvas au body
        document.body.appendChild(this.canvas);
    }
    
    createLeaves() {
        this.leaves = [];
        
        for (let i = 0; i < this.maxLeaves; i++) {
            this.leaves.push(this.createLeaf());
        }
    }
    
    createLeaf() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * -this.canvas.height,
            size: Math.random() * 0.5 + 0.4, // Taille entre 0.4 et 0.9
            speedY: Math.random() * 2 + 1, // Vitesse de chute
            speedX: Math.random() * 2 - 1, // Mouvement horizontal
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2,
            opacity: Math.random() * 0.6 + 0.4,
            swayAmplitude: Math.random() * 30 + 10,
            swaySpeed: Math.random() * 0.02 + 0.01
        };
    }
    
    updateLeaf(leaf) {
        // Mouvement vertical
        leaf.y += leaf.speedY;
        
        // Mouvement de balancement
        leaf.x += Math.sin(leaf.y * leaf.swaySpeed) * leaf.swayAmplitude * 0.01;
        
        // Effet du vent
        leaf.x += this.windStrength * Math.sin(Date.now() * 0.001 + leaf.x * 0.01);
        
        // Rotation
        leaf.rotation += leaf.rotationSpeed;
        
        // Réinitialiser la feuille si elle sort de l'écran
        if (leaf.y > this.canvas.height + 50) {
            leaf.y = Math.random() * -200 - 50;
            leaf.x = Math.random() * this.canvas.width;
        }
        
        // Maintenir les feuilles dans l'écran horizontalement
        if (leaf.x > this.canvas.width + 50) {
            leaf.x = -50;
        } else if (leaf.x < -50) {
            leaf.x = this.canvas.width + 50;
        }
    }
    
    drawLeaf(leaf) {
        this.ctx.save();
        
        // Transparence
        this.ctx.globalAlpha = leaf.opacity;
        
        // Position et rotation
        this.ctx.translate(leaf.x, leaf.y);
        this.ctx.rotate((leaf.rotation * Math.PI) / 180);
        this.ctx.scale(leaf.size, leaf.size);
        
        // Dessiner l'image de la feuille
        const size = 60;
        this.ctx.drawImage(
            this.leafImage,
            -size / 2,
            -size / 2,
            size,
            size
        );
        
        this.ctx.restore();
    }
    
    animate() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mettre à jour et dessiner chaque feuille
        if (this.isImageLoaded) {
            this.leaves.forEach(leaf => {
                this.updateLeaf(leaf);
                this.drawLeaf(leaf);
            });
        }
        
        // Continuer l'animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    start() {
        if (!this.animationId && this.isImageLoaded) {
            this.animate();
        }
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
    
    // Méthodes pour contrôler l'animation
    setWindStrength(strength) {
        this.windStrength = strength;
    }
    
    setMaxLeaves(count) {
        this.maxLeaves = count;
        this.createLeaves();
    }
}

// Initialiser l'animation quand la page est chargée
let fallingLeavesAnimation = null;

document.addEventListener('DOMContentLoaded', () => {
    // Créer l'animation avec un délai pour laisser la page se charger
    setTimeout(() => {
        fallingLeavesAnimation = new FallingLeavesAnimation();
    }, 1000);
});

// Fonction pour démarrer/arrêter l'animation
function toggleFallingLeaves() {
    if (fallingLeavesAnimation) {
        if (fallingLeavesAnimation.animationId) {
            fallingLeavesAnimation.stop();
        } else {
            fallingLeavesAnimation.start();
        }
    }
}

// Exporter pour utilisation globale
window.FallingLeavesAnimation = FallingLeavesAnimation;
window.toggleFallingLeaves = toggleFallingLeaves;