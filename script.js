let workTime = 25 * 60;
let breakTime = 5 * 60;
let isWorkTime = true;
let isRunning = false;
let timeRemaining = workTime;
let timerInterval;

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

if(!(window.localStorage.getItem("work") == null)){
    loadSettings();
}

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

function saveSettings() {
    window.localStorage.setItem("work",workTime);
    window.localStorage.setItem("break",breakTime);
}

function loadSettings() {
    workTime = window.localStorage.getItem("work");
    breakTime = window.localStorage.getItem("break");
    timeRemaining = workTime;
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}


function updateProgressBar() {
    const totalDuration = isWorkTime ? workTime : breakTime;
    const progress = ((totalDuration - timeRemaining) / totalDuration) * 565;
    progressBar.style.strokeDashoffset = 565 - progress;
}


function startTimer() {
    isRunning = true;
    play.textContent = 'replay';
    startBtn.classList.add('restart');
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimeDisplay();
        updateProgressBar();

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


function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeRemaining = isWorkTime ? workTime : breakTime;
    updateTimeDisplay();
    updateProgressBar();
    play.textContent = 'play_arrow';
    startBtn.classList.remove('restart');
}


startBtn.addEventListener('click', () => {
    if (isRunning) {
        resetTimer();
    } else {
        startTimer();
    }
});


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

settingsBtn.addEventListener('click', () => {
    modal.style.display = "block";
});

cancel.addEventListener('click', () => {
    modal.style.display = "none";
});

updateTimeDisplay();
updateProgressBar();
