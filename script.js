
/**Déclaration des variable avec leur valeurs par défaut*/

let workTime = 25 * 60;
let breakTime = 5 * 60;
let isWorkTime = true;
let isRunning = false;
let timeRemaining = workTime;
let timerInterval;

/**Récupération des différent ID utiles du HTML*/

const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const workBtn = document.getElementById('workBtn');
const breakBtn = document.getElementById('breakBtn');
const progressBar = document.getElementById('progressBar');
const settingsForm = document.getElementById('settingsForm');
const play = document.getElementById('play');
const settingsBtn = document.getElementById('settingsBtn');
const modal = document.getElementById('modal');
const cancel = document.getElementById('cancel');

/* Permet de vérifier si des paramètres ont déjà été sauvegardé et les chargent si c'est le cas*/
if(!(window.localStorage.getItem("work") == null)){
    loadSettings();
}

/*Un listener pour le formulaire qui permet de changer les paramètres du timer pomodoro et les sauvegardes dans le localStorage et actualise le timer*/
settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();  
    const newWorkDuration = parseInt(document.getElementById('workDuration').value);
    const newBreakDuration = parseInt(document.getElementById('breakDuration').value);

    workTime = newWorkDuration * 60;
    breakTime = newBreakDuration * 60;
    timeRemaining = document.body.classList.contains('work-mode') ? workTime : breakTime; 

    modal.style.display = "none";

    saveSettings();
    clearInterval(timerInterval);
    updateTimeDisplay();
    updateProgressBar();
});

/** Fonction qui sauvegarde les presets du timer dans le localStorage*/
function saveSettings() {
    window.localStorage.setItem("work",workTime);
    window.localStorage.setItem("break",breakTime);
}

/**Fonction chargeant les presets sauvegardés dans le localStorage*/
function loadSettings() {
    workTime = window.localStorage.getItem("work");
    breakTime = window.localStorage.getItem("break");
    timeRemaining = workTime;
}

/**Fonction à appelé pour mettre à jour le timer*/
function updateTimeDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/**Fonction mettant à jour la progress bar*/
function updateProgressBar() {
    const totalDuration = isWorkTime ? workTime : breakTime;
    const progress = ((totalDuration - timeRemaining) / totalDuration) * 565;
    progressBar.style.strokeDashoffset = 565 - progress;
}

/**Fonction qui permet de démarrer le timer*/
function startTimer() {
    isRunning = true;
    /**Transforme le bouton 'play' en bouton 'replay' et lui ajoute la classe*/
    play.textContent = 'replay';
    startBtn.classList.add('restart');

    /**Permet de faire un compteur qui passe en paramètre un intervalle de 1000ms (1 seconde) pour actualiser le temps du timer*/
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimeDisplay();
        updateProgressBar();

        /**Inverse le mode entre 'break' et 'work' à chaque fois que le timer atteint 0 puis redémarre le timer*/
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            if (isWorkTime) {
                timeRemaining = breakTime;
                isWorkTime = false;
                document.body.classList.remove('work-mode');
                document.body.classList.add('break-mode');
                workBtn.classList.remove('active');
                breakBtn.classList.add('active');
            } else {
                timeRemaining = workTime;
                isWorkTime = true;
                document.body.classList.remove('break-mode');
                document.body.classList.add('work-mode');
                breakBtn.classList.remove('active');
                workBtn.classList.add('active');
            }
            startTimer();
        }
    }, 1000);
}

/**Fonction qui remet le timer à ses paramètres d'origine*/
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeRemaining = isWorkTime ? workTime : breakTime;
    updateTimeDisplay();
    updateProgressBar();
    /**Transforme le bouton 'replay' en bouton 'play' et lui enlève la classe 'restart'*/
    play.textContent = 'play_arrow';
    startBtn.classList.remove('restart');
}

/**Un listener du bouton 'play'/'restart' qui vérifie la nature du bouton puis appelle la fonction correspondante*/
startBtn.addEventListener('click', () => {
    if (isRunning) {
        resetTimer();
    } else {
        startTimer();
    }
});

/**Listener qui vérifie si le chronomètre est bien à l'arrêt et permet de changer de mode entre 'break' et 'work'*/
workBtn.addEventListener('click', () => {
    if (!isRunning) {
        isWorkTime = true;
        timeRemaining = workTime;
        updateTimeDisplay();
        updateProgressBar();
        workBtn.classList.add('active');
        breakBtn.classList.remove('active');
        document.body.classList.add('work-mode');
        document.body.classList.remove('break-mode');
    }
});

breakBtn.addEventListener('click', () => {
    if (!isRunning) {
        isWorkTime = false;
        timeRemaining = breakTime;
        updateTimeDisplay();
        updateProgressBar();
        breakBtn.classList.add('active');
        workBtn.classList.remove('active');
        document.body.classList.remove('work-mode');
        document.body.classList.add('break-mode');
    }
});

/**Un listener sur le bouton 'settings' qui permet d'afficher la classe modale et donc le formulaire*/
settingsBtn.addEventListener('click', () => {
    modal.style.display = "block";
});

/**Un listener sur le bouton 'cancel' du formulaire qui permet de ne pas prendre en compte les modification et fais disparaître le formulaire*/
cancel.addEventListener('click', () => {
    modal.style.display = "none";
});

updateTimeDisplay();
updateProgressBar();
