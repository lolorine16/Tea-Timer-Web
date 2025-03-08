function afficherSection(id) {
    
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });

    
    document.getElementById(id).style.display = "block";
}


document.addEventListener("DOMContentLoaded", () => {
    afficherSection("accueil");
});

let timer;
let timeLeft;
let isPaused = false;

function startTimer(duration) {
    clearInterval(timer);
    if (!isPaused) {
        timeLeft = duration * 60; 
    }
    updateTimerDisplay();
    
    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                afficherSection('fin');
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    clearInterval(timer);
    const duration = parseInt(document.getElementById('timer-duration').value);
    startTimer(duration);
}

function stopTimer() {
    clearInterval(timer);
    isPaused = true;
}

function restartTimer() {
    if (isPaused && timeLeft > 0) {
        isPaused = false;
        startTimer(timeLeft / 60); 
    }
}

function afficherSection(id) {
   
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });

   
    document.getElementById(id).style.display = "block";

    
    if (id === 'timer') {
        const duration = parseInt(document.getElementById('timer-duration').value);
        startTimer(duration);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    afficherSection("accueil");
});