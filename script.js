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