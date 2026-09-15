const choiceButtons = document.querySelectorAll(".choice-btn");

const playerChoice = document.getElementById("playerChoice");
const computerChoice = document.getElementById("computerChoice");

const resultArea = document.querySelector(".result-area");
const resultText = document.getElementById("resultText");
const resultMessage = document.getElementById("resultMessage");
const streakMessage = document.getElementById("streakMessage");

const playerScoreElement = document.getElementById("playerScore");
const computerScoreElement = document.getElementById("computerScore");
const roundNumberElement = document.getElementById("roundNumber");

const gamesPlayedElement = document.getElementById("gamesPlayed");
const winsElement = document.getElementById("wins");
const winStreakElement = document.getElementById("winStreak");
const bestStreakElement = document.getElementById("bestStreak");

const restartButton = document.getElementById("restartBtn");
const soundToggle = document.getElementById("soundToggle");
const themeToggle = document.getElementById("themeToggle");

const choices = [
    "rock",
    "paper",
    "scissors"
];

const icons = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
};

let playerScore = 0;
let computerScore = 0;
let round = 0;

let gamesPlayed = 0;
let wins = 0;

let winStreak = 0;
let bestStreak = 0;

let soundOn = true;

let audioContext = null;


// Load saved data
function loadData() {

    const savedData =
        JSON.parse(
            localStorage.getItem("rpsData")
        );

    if (savedData) {

        gamesPlayed =
            savedData.gamesPlayed || 0;

        wins =
            savedData.wins || 0;

        bestStreak =
            savedData.bestStreak || 0;
    }


    const savedTheme =
        localStorage.getItem("rpsTheme");

    if (savedTheme === "light") {

        document.body.classList.add(
            "light-mode"
        );

        themeToggle.textContent = "🌙";
    }


    const savedSound =
        localStorage.getItem("rpsSound");

    if (savedSound === "off") {

        soundOn = false;

        soundToggle.textContent =
            "🔇 Sound Off";
    }


    updateStatistics();
}


// Save statistics
function saveData() {

    const data = {
        gamesPlayed: gamesPlayed,
        wins: wins,
        bestStreak: bestStreak
    };

    localStorage.setItem(
        "rpsData",
        JSON.stringify(data)
    );
}


// Generate computer choice
function getComputerChoice() {

    const randomIndex =
        Math.floor(
            Math.random() * choices.length
        );

    return choices[randomIndex];
}


// Check winner
function getWinner(player, computer) {

    if (player === computer) {
        return "draw";
    }


    if (
        (player === "rock" &&
            computer === "scissors") ||

        (player === "paper" &&
            computer === "rock") ||

        (player === "scissors" &&
            computer === "paper")
    ) {
        return "player";
    }


    return "computer";
}


// Get reusable audio context
function getAudioContext() {

    if (!audioContext) {

        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    return audioContext;
}


// Play sound
function playSound(type) {

    if (!soundOn) {
        return;
    }


    const context =
        getAudioContext();


    if (context.state === "suspended") {
        context.resume();
    }


    const oscillator =
        context.createOscillator();

    const gainNode =
        context.createGain();


    oscillator.connect(gainNode);
    gainNode.connect(
        context.destination
    );


    if (type === "win") {

        oscillator.frequency.value = 700;

    } else if (type === "lose") {

        oscillator.frequency.value = 250;

    } else {

        oscillator.frequency.value = 450;
    }


    oscillator.type = "sine";


    gainNode.gain.setValueAtTime(
        0.07,
        context.currentTime
    );


    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.2
    );


    oscillator.start();


    oscillator.stop(
        context.currentTime + 0.2
    );
}


// Update statistics
function updateStatistics() {

    playerScoreElement.textContent =
        playerScore;

    computerScoreElement.textContent =
        computerScore;

    roundNumberElement.textContent =
        round;


    gamesPlayedElement.textContent =
        gamesPlayed;

    winsElement.textContent =
        wins;

    winStreakElement.textContent =
        winStreak;

    bestStreakElement.textContent =
        bestStreak;
}


// Show streak message
function updateStreakMessage(winner) {

    streakMessage.classList.remove(
        "visible"
    );


    if (
        winner === "player" &&
        winStreak >= 2
    ) {

        if (winStreak === bestStreak) {

            streakMessage.textContent =
                `🔥 ${winStreak} win streak — new best!`;

        } else {

            streakMessage.textContent =
                `🔥 ${winStreak} win streak!`;
        }


        streakMessage.classList.add(
            "visible"
        );

    } else if (
        winner === "computer" &&
        round > 1
    ) {

        streakMessage.textContent =
            "Streak ended. Try again!";

        streakMessage.classList.add(
            "visible"
        );
    }
}


// Play one round
function playRound(player) {

    const computer =
        getComputerChoice();

    const winner =
        getWinner(
            player,
            computer
        );


    round++;
    gamesPlayed++;


    playerChoice.textContent =
        icons[player];

    computerChoice.textContent =
        icons[computer];


    playerChoice.classList.remove(
        "show"
    );

    computerChoice.classList.remove(
        "show"
    );


    void playerChoice.offsetWidth;
    void computerChoice.offsetWidth;


    playerChoice.classList.add(
        "show"
    );

    computerChoice.classList.add(
        "show"
    );


    resultArea.classList.remove(
        "animate"
    );

    void resultArea.offsetWidth;

    resultArea.classList.add(
        "animate"
    );


    resultText.classList.remove(
        "result-win",
        "result-lose",
        "result-draw"
    );


    if (winner === "player") {

        playerScore++;

        wins++;

        winStreak++;


        if (winStreak > bestStreak) {

            bestStreak =
                winStreak;
        }


        resultText.textContent =
            "You Win!";

        resultText.classList.add(
            "result-win"
        );


        resultMessage.textContent =
            `${capitalize(player)} beats ${computer}.`;


        playSound("win");


    } else if (winner === "computer") {

        computerScore++;

        winStreak = 0;


        resultText.textContent =
            "You Lose!";

        resultText.classList.add(
            "result-lose"
        );


        resultMessage.textContent =
            `${capitalize(computer)} beats ${player}.`;


        playSound("lose");


    } else {

        resultText.textContent =
            "It's a Draw!";

        resultText.classList.add(
            "result-draw"
        );


        resultMessage.textContent =
            `Both chose ${capitalize(player)}.`;


        playSound("draw");
    }


    updateStreakMessage(winner);

    updateStatistics();

    saveData();
}


// Capitalize first letter
function capitalize(word) {

    return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
    );
}


// Restart current game
function restartGame() {

    playerScore = 0;
    computerScore = 0;
    round = 0;
    winStreak = 0;


    playerChoice.textContent = "?";

    computerChoice.textContent = "?";


    resultText.textContent =
        "Choose your move to start";


    resultMessage.textContent =
        "Make your choice below";


    streakMessage.textContent = "";

    streakMessage.classList.remove(
        "visible"
    );


    resultText.classList.remove(
        "result-win",
        "result-lose",
        "result-draw"
    );


    updateStatistics();
}


// Toggle sound
function toggleSound() {

    soundOn = !soundOn;


    if (soundOn) {

        soundToggle.textContent =
            "🔊 Sound On";

        localStorage.setItem(
            "rpsSound",
            "on"
        );

    } else {

        soundToggle.textContent =
            "🔇 Sound Off";

        localStorage.setItem(
            "rpsSound",
            "off"
        );
    }
}


// Toggle theme
function toggleTheme() {

    document.body.classList.toggle(
        "light-mode"
    );


    const isLight =
        document.body.classList.contains(
            "light-mode"
        );


    if (isLight) {

        themeToggle.textContent =
            "🌙";

        localStorage.setItem(
            "rpsTheme",
            "light"
        );

    } else {

        themeToggle.textContent =
            "☀️";

        localStorage.setItem(
            "rpsTheme",
            "dark"
        );
    }
}


// Choice button events
choiceButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const choice =
                button.dataset.choice;

            playRound(choice);
        }
    );
});


restartButton.addEventListener(
    "click",
    restartGame
);


soundToggle.addEventListener(
    "click",
    toggleSound
);


themeToggle.addEventListener(
    "click",
    toggleTheme
);


// Start application
loadData();