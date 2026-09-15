const startScreen = document.getElementById("startScreen");
const tossScreen = document.getElementById("tossScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const howToPlayBtn = document.getElementById("howToPlayBtn");
const soundBtn = document.getElementById("soundBtn");
const themeBtn = document.getElementById("themeBtn");

const tossResult = document.getElementById("tossResult");
const tossActions = document.getElementById("tossActions");
const continueBtn = document.getElementById("continueBtn");
const tossButtons = document.querySelectorAll(".choice-btn");

const inningsTitle = document.getElementById("inningsTitle");
const inningsBadge = document.getElementById("inningsBadge");
const battingPlayer = document.getElementById("battingPlayer");

const score = document.getElementById("score");
const wickets = document.getElementById("wickets");
const balls = document.getElementById("balls");

const targetBox = document.getElementById("targetBox");
const targetScore = document.getElementById("targetScore");

const playerNumber = document.getElementById("playerNumber");
const computerNumber = document.getElementById("computerNumber");
const resultMessage = document.getElementById("resultMessage");

const playerScore = document.getElementById("playerScore");
const computerScore = document.getElementById("computerScore");
const currentInnings = document.getElementById("currentInnings");

const numberButtons = document.querySelectorAll(".number-btn");

const newMatchBtn = document.getElementById("newMatchBtn");
const pauseBtn = document.getElementById("pauseBtn");

const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");

const finalPlayerScore = document.getElementById("finalPlayerScore");
const finalComputerScore = document.getElementById("finalComputerScore");

const playAgainBtn = document.getElementById("playAgainBtn");
const homeBtn = document.getElementById("homeBtn");

const howToModal = document.getElementById("howToModal");
const closeHowToBtn = document.getElementById("closeHowToBtn");
const modalStartBtn = document.getElementById("modalStartBtn");

const confirmModal = document.getElementById("confirmModal");
const confirmTitle = document.getElementById("confirmTitle");
const confirmText = document.getElementById("confirmText");
const cancelConfirmBtn = document.getElementById("cancelConfirmBtn");
const confirmActionBtn = document.getElementById("confirmActionBtn");

const pauseOverlay = document.getElementById("pauseOverlay");
const resumeBtn = document.getElementById("resumeBtn");
const quitBtn = document.getElementById("quitBtn");

const toast = document.getElementById("toast");


let innings = 1;
let playerBatting = true;

let playerTotal = 0;
let computerTotal = 0;

let inningsScore = 0;
let inningsWickets = 0;
let inningsBalls = 0;

let target = 0;

let matchOver = false;
let isPaused = false;

let selectedToss = "";

let soundEnabled = true;
let audioContext = null;

let pendingAction = null;

const STORAGE_KEY = "handCricketStats";
const THEME_KEY = "handCricketTheme";
const SOUND_KEY = "handCricketSound";

let stats = {
    played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    bestScore: 0
};


/* Load saved settings and statistics */

function loadData() {

    const savedStats = localStorage.getItem(STORAGE_KEY);

    if (savedStats) {
        try {
            stats = JSON.parse(savedStats);
        } catch {
            stats = {
                played: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                bestScore: 0
            };
        }
    }

    const savedTheme =
        localStorage.getItem(THEME_KEY);

    if (savedTheme === "light") {

        document.body.classList.add("light");

        themeBtn.textContent = "☀";

    } else {

        themeBtn.textContent = "☾";
    }


    const savedSound =
        localStorage.getItem(SOUND_KEY);

    if (savedSound !== null) {
        soundEnabled = savedSound === "true";
    }

    updateSoundButton();
}


/* Save statistics */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(stats)
    );
}


/* Show screen */

function showScreen(screen) {

    document.querySelectorAll(".screen").forEach(item => {
        item.classList.remove("active");
    });

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* Toast */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}


/* Audio */

function getAudioContext() {

    if (!audioContext) {

        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    return audioContext;
}


function playSound(type) {

    if (!soundEnabled) return;

    const context = getAudioContext();

    if (context.state === "suspended") {
        context.resume();
    }

    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);

    const frequencies = {
        click: 450,
        run: 650,
        wicket: 180,
        win: 800,
        lose: 220,
        toss: 520
    };

    oscillator.frequency.value =
        frequencies[type] || 450;

    oscillator.type = "sine";

    gain.gain.setValueAtTime(
        0.08,
        context.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.18
    );

    oscillator.start();

    oscillator.stop(
        context.currentTime + 0.18
    );
}


/* Sound button */

function updateSoundButton() {

    soundBtn.textContent =
        soundEnabled ? "🔊" : "🔇";
}


soundBtn.addEventListener("click", () => {

    soundEnabled = !soundEnabled;

    localStorage.setItem(
        SOUND_KEY,
        soundEnabled
    );

    updateSoundButton();

    if (soundEnabled) {
        playSound("click");
    }
});


/* Theme button */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    localStorage.setItem(
        THEME_KEY,
        isLight ? "light" : "dark"
    );

    themeBtn.textContent =
        isLight ? "☀" : "☾";

    playSound("click");
});


/* Reset match */

function resetMatch() {

    innings = 1;

    playerBatting = true;

    playerTotal = 0;
    computerTotal = 0;

    inningsScore = 0;
    inningsWickets = 0;
    inningsBalls = 0;

    target = 0;

    matchOver = false;
    isPaused = false;

    selectedToss = "";

    pauseOverlay.classList.add("hidden");

    tossActions.innerHTML = "";

    continueBtn.classList.add("hidden");

    tossButtons.forEach(button => {
        button.classList.remove("selected");
        button.disabled = false;
    });

    numberButtons.forEach(button => {
        button.disabled = false;
    });

    playerNumber.textContent = "?";
    computerNumber.textContent = "?";

    resultMessage.textContent =
        "Choose a number to play";

    resultMessage.className =
        "result-message";

    pauseBtn.textContent = "Pause";

    updateGameUI();
}


/* Start match */

startBtn.addEventListener("click", () => {

    resetMatch();

    showScreen(tossScreen);

    tossResult.textContent =
        "Choose Heads or Tails";

    playSound("click");
});


/* Toss */

tossButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (selectedToss) return;

        selectedToss =
            button.dataset.choice;

        tossButtons.forEach(item => {
            item.classList.remove("selected");
            item.disabled = true;
        });

        button.classList.add("selected");

        const computerChoice =
            Math.random() < 0.5
                ? "heads"
                : "tails";

        playSound("toss");

        if (selectedToss === computerChoice) {

            tossResult.textContent =
                `It's ${capitalize(computerChoice)}! You won the toss.`;

            showToast("You won the toss!");

            showTossDecision();

        } else {

            tossResult.textContent =
                `It's ${capitalize(computerChoice)}! Computer won the toss.`;

            showToast("Computer won the toss!");

            setTimeout(() => {
                computerChooses();
            }, 700);
        }
    });
});


/* Capitalize text */

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
        text.slice(1);
}


/* Player chooses batting or bowling */

function showTossDecision() {

    tossActions.innerHTML = "";

    const text =
        document.createElement("p");

    text.textContent =
        "Choose whether you want to bat or bowl first.";

    text.style.marginTop = "15px";
    text.style.color = "var(--secondary)";
    text.style.fontSize = "13px";

    tossActions.appendChild(text);


    const batButton =
        document.createElement("button");

    batButton.className =
        "primary-btn";

    batButton.textContent =
        "🏏 Bat First";

    batButton.style.marginTop =
        "15px";


    const bowlButton =
        document.createElement("button");

    bowlButton.className =
        "secondary-btn";

    bowlButton.textContent =
        "🎯 Bowl First";


    tossActions.appendChild(batButton);
    tossActions.appendChild(bowlButton);


    batButton.addEventListener("click", () => {

        playerBatting = true;

        playSound("click");

        beginInnings();
    });


    bowlButton.addEventListener("click", () => {

        playerBatting = false;

        playSound("click");

        beginInnings();
    });
}


/* Computer chooses batting or bowling */

function computerChooses() {

    playerBatting =
        Math.random() < 0.5;

    if (playerBatting) {

        tossResult.textContent =
            "Computer chose to bowl. You will bat first.";

    } else {

        tossResult.textContent =
            "Computer chose to bat. You will bowl first.";
    }

    continueBtn.textContent =
        "Start Innings";

    continueBtn.classList.remove("hidden");

    continueBtn.onclick = () => {
        beginInnings();
    };
}


/* Begin innings */

function beginInnings() {

    inningsScore = 0;
    inningsWickets = 0;
    inningsBalls = 0;

    playerNumber.textContent = "?";
    computerNumber.textContent = "?";

    tossActions.innerHTML = "";

    continueBtn.classList.add("hidden");

    showScreen(gameScreen);

    resultMessage.className =
        "result-message";

    resultMessage.textContent =
        playerBatting
            ? "Choose your runs"
            : "Choose your bowling number";

    updateGameUI();
}


/* Update game UI */

function updateGameUI() {

    inningsTitle.textContent =
        innings === 1
            ? "1st Innings"
            : "2nd Innings";

    currentInnings.textContent =
        innings;

    battingPlayer.textContent =
        playerBatting
            ? "You"
            : "Computer";

    inningsBadge.textContent =
        playerBatting
            ? "BATTING"
            : "BOWLING";

    score.textContent =
        inningsScore;

    wickets.textContent =
        inningsWickets;

    balls.textContent =
        `${inningsBalls} ball${inningsBalls === 1 ? "" : "s"}`;

    playerScore.textContent =
        playerTotal;

    computerScore.textContent =
        computerTotal;


    if (innings === 2) {

        targetBox.classList.remove("hidden");

        targetScore.textContent =
            target;

    } else {

        targetBox.classList.add("hidden");
    }
}


/* Play one ball */

function playRound(playerChoice) {

    if (matchOver || isPaused) return;

    const computerChoice =
        Math.floor(Math.random() * 6) + 1;

    playerNumber.textContent =
        playerChoice;

    computerNumber.textContent =
        computerChoice;

    inningsBalls++;


    /* Same number means wicket */

    if (playerChoice === computerChoice) {

        inningsWickets = 1;

        playSound("wicket");

        if (playerBatting) {

            resultMessage.textContent =
                `OUT! You finished with ${playerTotal} run${playerTotal === 1 ? "" : "s"}.`;

        } else {

            resultMessage.textContent =
                `OUT! Computer finished with ${computerTotal} run${computerTotal === 1 ? "" : "s"}.`;
        }

        resultMessage.className =
            "result-message danger";

        updateGameUI();

        numberButtons.forEach(button => {
            button.disabled = true;
        });

        setTimeout(() => {
            finishInnings();
        }, 900);

        return;
    }


    /* Batting */

    if (playerBatting) {

        inningsScore += playerChoice;

        playerTotal = inningsScore;

        resultMessage.textContent =
            `You scored ${playerChoice} run${playerChoice === 1 ? "" : "s"}.`;

        resultMessage.className =
            "result-message success";

        playSound("run");

    } else {

        inningsScore += computerChoice;

        computerTotal = inningsScore;

        resultMessage.textContent =
            `Computer scored ${computerChoice} run${computerChoice === 1 ? "" : "s"}.`;

        resultMessage.className =
            "result-message danger";

        playSound("run");
    }


    updateGameUI();


    /* Check target */

    if (
        innings === 2 &&
        inningsScore >= target
    ) {

        setTimeout(() => {
            finishMatch();
        }, 500);
    }
}


/* Number buttons */

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (
            matchOver ||
            isPaused ||
            button.disabled
        ) {
            return;
        }

        const number =
            Number(button.dataset.number);

        playRound(number);
    });

});


/* Finish innings */

function finishInnings() {

    numberButtons.forEach(button => {
        button.disabled = true;
    });


    setTimeout(() => {

        if (innings === 1) {

            target =
                playerBatting
                    ? playerTotal + 1
                    : computerTotal + 1;

            innings = 2;

            playerBatting =
                !playerBatting;

            inningsScore = 0;
            inningsWickets = 0;
            inningsBalls = 0;

            playerNumber.textContent = "?";
            computerNumber.textContent = "?";

            numberButtons.forEach(button => {
                button.disabled = false;
            });

            resultMessage.className =
                "result-message";

            resultMessage.textContent =
                playerBatting
                    ? `Second innings. You need ${target} runs to win.`
                    : `Second innings. Computer needs ${target} runs to win.`;

            updateGameUI();

        } else {

            finishMatch();
        }

    }, 700);
}


/* Finish match */

function finishMatch() {

    if (matchOver) return;

    matchOver = true;

    numberButtons.forEach(button => {
        button.disabled = true;
    });


    stats.played++;


    if (playerTotal > computerTotal) {

        stats.wins++;

        if (playerTotal > stats.bestScore) {
            stats.bestScore = playerTotal;
        }

        resultIcon.textContent = "🏆";

        resultTitle.textContent =
            "You Won!";

        resultText.textContent =
            `Great job! You defeated the computer by ${playerTotal - computerTotal} run${playerTotal - computerTotal === 1 ? "" : "s"}.`;

        playSound("win");

    } else if (computerTotal > playerTotal) {

        stats.losses++;

        resultIcon.textContent = "😔";

        resultTitle.textContent =
            "Computer Won";

        resultText.textContent =
            `The computer won by ${computerTotal - playerTotal} run${computerTotal - playerTotal === 1 ? "" : "s"}.`;

        playSound("lose");

    } else {

        stats.draws++;

        resultIcon.textContent = "🤝";

        resultTitle.textContent =
            "It's a Draw!";

        resultText.textContent =
            "Both sides finished with the same score.";

        playSound("click");
    }


    saveData();

    finalPlayerScore.textContent =
        playerTotal;

    finalComputerScore.textContent =
        computerTotal;


    setTimeout(() => {
        showScreen(resultScreen);
    }, 600);
}


/* New Match */

newMatchBtn.addEventListener("click", () => {

    openConfirmModal(
        "Start New Match?",
        "Your current match will be lost.",
        startNewMatch
    );
});


function startNewMatch() {

    resetMatch();

    showScreen(startScreen);

    playSound("click");
}


/* Pause */

pauseBtn.addEventListener("click", () => {

    if (matchOver) return;

    isPaused = true;

    pauseOverlay.classList.remove("hidden");

    numberButtons.forEach(button => {
        button.disabled = true;
    });

    playSound("click");
});


/* Resume */

resumeBtn.addEventListener("click", () => {

    isPaused = false;

    pauseOverlay.classList.add("hidden");

    numberButtons.forEach(button => {
        button.disabled = false;
    });

    playSound("click");
});


/* Quit */

quitBtn.addEventListener("click", () => {

    openConfirmModal(
        "Quit Match?",
        "Your current match will be lost.",
        quitMatch
    );
});


function quitMatch() {

    resetMatch();

    showScreen(startScreen);

    playSound("click");
}


/* Confirmation modal */

function openConfirmModal(
    title,
    message,
    action
) {

    pendingAction = action;

    confirmTitle.textContent =
        title;

    confirmText.textContent =
        message;

    confirmModal.classList.remove("hidden");
}


function closeConfirmModal() {

    confirmModal.classList.add("hidden");

    pendingAction = null;
}


cancelConfirmBtn.addEventListener(
    "click",
    closeConfirmModal
);


confirmActionBtn.addEventListener(
    "click",
    () => {

        if (pendingAction) {

            const action =
                pendingAction;

            closeConfirmModal();

            action();
        }
    }
);


/* Play Again */

playAgainBtn.addEventListener("click", () => {

    resetMatch();

    showScreen(tossScreen);

    tossResult.textContent =
        "Choose Heads or Tails";

    playSound("click");
});


/* Back to Home */

homeBtn.addEventListener("click", () => {

    resetMatch();

    showScreen(startScreen);

    playSound("click");
});


/* How to Play */

howToPlayBtn.addEventListener("click", () => {

    howToModal.classList.remove("hidden");

    playSound("click");
});


closeHowToBtn.addEventListener("click", () => {

    howToModal.classList.add("hidden");
});


modalStartBtn.addEventListener("click", () => {

    howToModal.classList.add("hidden");

    playSound("click");
});


/* Close modals by clicking outside */

howToModal.addEventListener(
    "click",
    event => {

        if (event.target === howToModal) {
            howToModal.classList.add("hidden");
        }
    }
);


confirmModal.addEventListener(
    "click",
    event => {

        if (event.target === confirmModal) {
            closeConfirmModal();
        }
    }
);


/* Keyboard controls */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            howToModal.classList.add("hidden");

            closeConfirmModal();

            if (
                !pauseOverlay.classList.contains("hidden")
            ) {

                isPaused = false;

                pauseOverlay.classList.add("hidden");

                numberButtons.forEach(button => {
                    button.disabled = false;
                });
            }
        }


        if (
            event.code === "Space" &&
            gameScreen.classList.contains("active")
        ) {

            event.preventDefault();

            if (isPaused) {
                resumeBtn.click();
            } else {
                pauseBtn.click();
            }
        }
    }
);


/* Initialize */

loadData();

updateGameUI();