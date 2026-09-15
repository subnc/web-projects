const setupSection = document.getElementById("setupSection");
const countdownSection = document.getElementById("countdownSection");
const completeSection = document.getElementById("completeSection");

const eventNameInput = document.getElementById("eventName");
const targetDateInput = document.getElementById("targetDate");
const targetTimeInput = document.getElementById("targetTime");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const newCountdownButton = document.getElementById("newCountdownButton");
const themeButton = document.getElementById("themeButton");

const displayEventName = document.getElementById("displayEventName");
const displayDateTime = document.getElementById("displayDateTime");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const completeMessage = document.getElementById("completeMessage");

const presetButtons = document.querySelectorAll(".preset-button");

let countdownInterval = null;
let targetTimestamp = null;
let startTimestamp = null;
let pausedRemaining = null;
let isPaused = false;
let currentEventName = "";

const STORAGE_KEY = "countdownClockData";

function setMinimumDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    targetDateInput.min = `${year}-${month}-${day}`;
}

function formatNumber(number) {
    return String(number).padStart(2, "0");
}

function saveCountdown() {
    const countdownData = {
        eventName: currentEventName,
        targetTimestamp: targetTimestamp,
        startTimestamp: startTimestamp,
        pausedRemaining: pausedRemaining,
        isPaused: isPaused
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(countdownData)
    );
}

function removeSavedCountdown() {
    localStorage.removeItem(STORAGE_KEY);
}

function showSetup() {
    setupSection.classList.remove("hidden");
    countdownSection.classList.add("hidden");
    completeSection.classList.add("hidden");
}

function showCountdown() {
    setupSection.classList.add("hidden");
    countdownSection.classList.remove("hidden");
    completeSection.classList.add("hidden");
}

function showComplete() {
    setupSection.classList.add("hidden");
    countdownSection.classList.add("hidden");
    completeSection.classList.remove("hidden");
}

function displayCountdownInfo() {
    displayEventName.textContent = currentEventName;

    const date = new Date(targetTimestamp);

    displayDateTime.textContent = date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function updateCountdown() {
    if (targetTimestamp === null) {
        return;
    }

    let remainingMilliseconds;

    if (isPaused) {
        remainingMilliseconds = pausedRemaining;
    } else {
        remainingMilliseconds = targetTimestamp - Date.now();
    }

    if (remainingMilliseconds <= 0) {
        finishCountdown();
        return;
    }

    const totalSeconds =
        Math.floor(remainingMilliseconds / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours =
        Math.floor((totalSeconds % 86400) / 3600);
    const minutes =
        Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysElement.textContent = formatNumber(days);
    hoursElement.textContent = formatNumber(hours);
    minutesElement.textContent = formatNumber(minutes);
    secondsElement.textContent = formatNumber(seconds);

    updateProgress(remainingMilliseconds);
}

function updateProgress(remainingMilliseconds) {
    if (!startTimestamp || !targetTimestamp) {
        return;
    }

    const totalDuration =
        targetTimestamp - startTimestamp;

    const elapsedDuration =
        totalDuration - remainingMilliseconds;

    let progress =
        (elapsedDuration / totalDuration) * 100;

    progress = Math.max(0, Math.min(100, progress));

    progressText.textContent =
        `${Math.floor(progress)}%`;

    progressFill.style.width =
        `${progress}%`;
}

function startCountdown() {
    const eventName =
        eventNameInput.value.trim();

    const dateValue =
        targetDateInput.value;

    const timeValue =
        targetTimeInput.value;

    if (!dateValue || !timeValue) {
        alert("Please select a date and time.");
        return;
    }

    const targetDateTime =
        new Date(`${dateValue}T${timeValue}:00`);

    const target =
        targetDateTime.getTime();

    if (isNaN(target)) {
        alert("Please enter a valid date and time.");
        return;
    }

    if (target <= Date.now()) {
        alert("Please select a future date and time.");
        return;
    }

    currentEventName =
        eventName || "My Event";

    targetTimestamp = target;
    startTimestamp = Date.now();
    pausedRemaining = null;
    isPaused = false;

    pauseButton.textContent = "Pause";

    displayCountdownInfo();
    showCountdown();
    saveCountdown();

    clearInterval(countdownInterval);

    countdownInterval =
        setInterval(updateCountdown, 1000);

    updateCountdown();
}

function startPreset(minutes) {
    const now = Date.now();

    currentEventName =
        `${formatPresetName(minutes)} Countdown`;

    startTimestamp = now;
    targetTimestamp =
        now + minutes * 60 * 1000;

    pausedRemaining = null;
    isPaused = false;

    pauseButton.textContent = "Pause";

    displayCountdownInfo();
    showCountdown();
    saveCountdown();

    clearInterval(countdownInterval);

    countdownInterval =
        setInterval(updateCountdown, 1000);

    updateCountdown();
}

function formatPresetName(minutes) {
    if (minutes === 1) {
        return "1 Minute";
    }

    if (minutes === 60) {
        return "1 Hour";
    }

    if (minutes === 1440) {
        return "1 Day";
    }

    return `${minutes} Minutes`;
}

function togglePause() {
    if (targetTimestamp === null) {
        return;
    }

    if (!isPaused) {
        pausedRemaining =
            targetTimestamp - Date.now();

        if (pausedRemaining <= 0) {
            finishCountdown();
            return;
        }

        isPaused = true;
        pauseButton.textContent = "Resume";

        clearInterval(countdownInterval);

        saveCountdown();
        updateCountdown();

    } else {
        const totalDuration =
            getOriginalDuration();

        targetTimestamp =
            Date.now() + pausedRemaining;

        startTimestamp =
            targetTimestamp - totalDuration;

        pausedRemaining = null;
        isPaused = false;

        pauseButton.textContent = "Pause";

        saveCountdown();

        clearInterval(countdownInterval);

        countdownInterval =
            setInterval(updateCountdown, 1000);

        updateCountdown();
    }
}

function getOriginalDuration() {
    const savedData =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

    if (
        savedData &&
        savedData.startTimestamp &&
        savedData.targetTimestamp
    ) {
        return (
            savedData.targetTimestamp -
            savedData.startTimestamp
        );
    }

    return 0;
}

function resetCountdown() {
    clearInterval(countdownInterval);

    countdownInterval = null;
    targetTimestamp = null;
    startTimestamp = null;
    pausedRemaining = null;
    isPaused = false;
    currentEventName = "";

    removeSavedCountdown();

    eventNameInput.value = "";
    targetDateInput.value = "";
    targetTimeInput.value = "";

    progressText.textContent = "0%";
    progressFill.style.width = "0%";

    pauseButton.textContent = "Pause";

    showSetup();
}

function finishCountdown() {
    clearInterval(countdownInterval);

    countdownInterval = null;
    targetTimestamp = null;
    pausedRemaining = null;
    isPaused = false;

    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    progressText.textContent = "100%";
    progressFill.style.width = "100%";

    completeMessage.textContent =
        `${currentEventName} has finished.`;

    removeSavedCountdown();

    playCompletionSound();
    showComplete();
}

function playCompletionSound() {
    try {
        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        const audioContext =
            new AudioContext();

        const oscillator =
            audioContext.createOscillator();

        const gainNode =
            audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            660,
            audioContext.currentTime
        );

        oscillator.frequency.setValueAtTime(
            880,
            audioContext.currentTime + 0.15
        );

        gainNode.gain.setValueAtTime(
            0.001,
            audioContext.currentTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.25,
            audioContext.currentTime + 0.02
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.5
        );

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.5
        );

    } catch (error) {
        console.log("Sound could not be played.");
    }
}

function loadSavedCountdown() {
    const savedData =
        localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        return;
    }

    try {
        const data =
            JSON.parse(savedData);

        currentEventName =
            data.eventName || "My Event";

        targetTimestamp =
            data.targetTimestamp;

        startTimestamp =
            data.startTimestamp;

        pausedRemaining =
            data.pausedRemaining;

        isPaused =
            data.isPaused || false;

        if (!targetTimestamp) {
            removeSavedCountdown();
            return;
        }

        if (isPaused) {
            pauseButton.textContent = "Resume";

            displayCountdownInfo();
            showCountdown();

            updateCountdown();

            return;
        }

        if (targetTimestamp <= Date.now()) {
            finishCountdown();
            return;
        }

        displayCountdownInfo();
        showCountdown();

        clearInterval(countdownInterval);

        countdownInterval =
            setInterval(updateCountdown, 1000);

        updateCountdown();

    } catch (error) {
        removeSavedCountdown();
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const darkModeEnabled =
        document.body.classList.contains("dark-theme");

    localStorage.setItem(
        "countdownTheme",
        darkModeEnabled ? "dark" : "light"
    );

    themeButton.textContent =
        darkModeEnabled ? "☀️" : "🌙";
}

function loadTheme() {
    const savedTheme =
        localStorage.getItem("countdownTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeButton.textContent = "☀️";
    } else {
        themeButton.textContent = "🌙";
    }
}

newCountdownButton.addEventListener(
    "click",
    resetCountdown
);

startButton.addEventListener(
    "click",
    startCountdown
);

pauseButton.addEventListener(
    "click",
    togglePause
);

resetButton.addEventListener(
    "click",
    resetCountdown
);

themeButton.addEventListener(
    "click",
    toggleTheme
);

presetButtons.forEach(button => {
    button.addEventListener("click", () => {
        const minutes =
            Number(button.dataset.minutes);

        startPreset(minutes);
    });
});

setMinimumDate();
loadTheme();
loadSavedCountdown();