const playerDice = document.getElementById("playerDice");
const computerDice = document.getElementById("computerDice");

const playerDiceArea =
    document.getElementById("playerDiceArea");

const computerDiceArea =
    document.getElementById("computerDiceArea");

const playerScore =
    document.getElementById("playerScore");

const computerScore =
    document.getElementById("computerScore");

const roundText =
    document.getElementById("roundText");

const streakText =
    document.getElementById("streakText");

const bestStreakText =
    document.getElementById("bestStreakText");

const playerResult =
    document.getElementById("playerResult");

const computerResult =
    document.getElementById("computerResult");

const roundMessage =
    document.getElementById("roundMessage");

const rollBtn =
    document.getElementById("rollBtn");

const newGameBtn =
    document.getElementById("newGameBtn");

const themeBtn =
    document.getElementById("themeBtn");

const soundBtn =
    document.getElementById("soundBtn");

const gamesPlayed =
    document.getElementById("gamesPlayed");

const gamesWon =
    document.getElementById("gamesWon");

const totalWins =
    document.getElementById("totalWins");

const overallBestStreak =
    document.getElementById("overallBestStreak");

const roundHistory =
    document.getElementById("roundHistory");

const resultModal =
    document.getElementById("resultModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const finalTitle =
    document.getElementById("finalTitle");

const finalPlayerScore =
    document.getElementById("finalPlayerScore");

const finalComputerScore =
    document.getElementById("finalComputerScore");

const finalMessage =
    document.getElementById("finalMessage");

const toast =
    document.getElementById("toast");

let currentRound = 1;

let playerPoints = 0;
let computerPoints = 0;

let currentStreak = 0;

let gameOver = false;
let rolling = false;

let soundOn = true;

let audioContext = null;

let toastTimer;

let stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    totalWins: 0,
    bestStreak: 0
};

// Show notification
function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.className = "toast show";

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// Generate random dice value
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// Play sound using Web Audio API
function playSound(type) {

    if (!soundOn) {
        return;
    }

    try {

        if (!audioContext) {
            audioContext = new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(
            audioContext.destination
        );

        if (type === "roll") {
            oscillator.frequency.value = 180;
        } else if (type === "win") {
            oscillator.frequency.value = 620;
        } else if (type === "lose") {
            oscillator.frequency.value = 220;
        } else {
            oscillator.frequency.value = 420;
        }

        oscillator.type = "sine";

        gain.gain.setValueAtTime(
            0.08,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.18
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.18
        );

    } catch (error) {
        // Sound is optional if Web Audio is unavailable.
    }
}

// Animate dice
function animateDice(diceElement, finalValue) {

    diceElement.classList.remove("rolling");

    void diceElement.offsetWidth;

    diceElement.classList.add("rolling");

    let animationCount = 0;

    const animation = setInterval(() => {

        const randomValue = rollDice();

        diceElement.dataset.value =
            randomValue;

        animationCount++;

        if (animationCount >= 8) {

            clearInterval(animation);

            diceElement.dataset.value =
                finalValue;

            diceElement.classList.remove(
                "rolling"
            );
        }

    }, 70);
}

// Highlight round result
function highlightRoundResult(result) {

    playerDiceArea.classList.remove(
        "winner",
        "loser",
        "draw"
    );

    computerDiceArea.classList.remove(
        "winner",
        "loser",
        "draw"
    );

    if (result === "win") {

        playerDiceArea.classList.add(
            "winner"
        );

        computerDiceArea.classList.add(
            "loser"
        );

    } else if (result === "loss") {

        playerDiceArea.classList.add(
            "loser"
        );

        computerDiceArea.classList.add(
            "winner"
        );

    } else {

        playerDiceArea.classList.add(
            "draw"
        );

        computerDiceArea.classList.add(
            "draw"
        );
    }
}

// Add round history
function addRoundHistory(
    round,
    playerValue,
    computerValue,
    result
) {

    if (
        roundHistory.querySelector(
            ".empty-history"
        )
    ) {
        roundHistory.innerHTML = "";
    }

    const historyItem =
        document.createElement("div");

    historyItem.className =
        "round-history-item";

    let resultClass = "draw";

    if (result === "win") {
        resultClass = "win";
    } else if (result === "loss") {
        resultClass = "loss";
    }

    const resultText =
        result === "win"
            ? "You Win"
            : result === "loss"
                ? "Computer Wins"
                : "Draw";

    historyItem.innerHTML = `
        <div class="history-round">
            Round ${round}
        </div>

        <div class="history-score">
            You ${playerValue}
            <span>—</span>
            Computer ${computerValue}
        </div>

        <div class="history-result ${resultClass}">
            ${resultText}
        </div>
    `;

    roundHistory.appendChild(
        historyItem
    );
}

// Roll one round
function rollRound() {

    if (gameOver || rolling) {
        return;
    }

    rolling = true;

    rollBtn.disabled = true;
    rollBtn.textContent = "Rolling...";

    playSound("roll");

    const playerValue = rollDice();
    const computerValue = rollDice();

    animateDice(
        playerDice,
        playerValue
    );

    animateDice(
        computerDice,
        computerValue
    );

    playerResult.textContent =
        "Rolling...";

    computerResult.textContent =
        "Rolling...";

    roundMessage.textContent =
        "The dice are rolling...";

    setTimeout(() => {

        processRound(
            playerValue,
            computerValue
        );

    }, 700);
}

// Process round result
function processRound(
    playerValue,
    computerValue
) {

    let roundResult = "draw";

    if (playerValue > computerValue) {

        roundResult = "win";

        playerPoints++;

        currentStreak++;

        stats.totalWins++;

        if (
            currentStreak >
            stats.bestStreak
        ) {
            stats.bestStreak =
                currentStreak;
        }

        playerResult.textContent =
            `Rolled ${playerValue} — Winner`;

        computerResult.textContent =
            `Rolled ${computerValue}`;

        roundMessage.textContent =
            "You won this round!";

        playSound("win");

    } else if (
        computerValue > playerValue
    ) {

        roundResult = "loss";

        computerPoints++;

        currentStreak = 0;

        playerResult.textContent =
            `Rolled ${playerValue}`;

        computerResult.textContent =
            `Rolled ${computerValue} — Winner`;

        roundMessage.textContent =
            "Computer won this round.";

        playSound("lose");

    } else {

        playerResult.textContent =
            `Rolled ${playerValue}`;

        computerResult.textContent =
            `Rolled ${computerValue}`;

        roundMessage.textContent =
            "It's a draw!";

        playSound("draw");
    }

    addRoundHistory(
        currentRound,
        playerValue,
        computerValue,
        roundResult
    );

    highlightRoundResult(
        roundResult
    );

    updateGameDisplay();

    rolling = false;

    if (currentRound >= 5) {

        finishGame();

        return;
    }

    currentRound++;

    updateGameDisplay();

    rollBtn.disabled = false;
    rollBtn.textContent = "Roll Dice";
}

// Update display
function updateGameDisplay() {

    playerScore.textContent =
        playerPoints;

    computerScore.textContent =
        computerPoints;

    roundText.textContent =
        `${currentRound} / 5`;

    streakText.textContent =
        currentStreak;

    bestStreakText.textContent =
        stats.bestStreak;

    gamesPlayed.textContent =
        stats.gamesPlayed;

    gamesWon.textContent =
        stats.gamesWon;

    totalWins.textContent =
        stats.totalWins;

    overallBestStreak.textContent =
        stats.bestStreak;
}

// Finish match
function finishGame() {

    gameOver = true;

    stats.gamesPlayed++;

    if (playerPoints > computerPoints) {

        stats.gamesWon++;

        finalTitle.textContent =
            "You Win!";

        finalMessage.textContent =
            "Excellent battle! You defeated the computer.";

        playSound("win");

    } else if (
        computerPoints > playerPoints
    ) {

        finalTitle.textContent =
            "Computer Wins";

        finalMessage.textContent =
            "Good game! Try again and beat the computer.";

        playSound("lose");

    } else {

        finalTitle.textContent =
            "It's a Draw!";

        finalMessage.textContent =
            "A close battle. Neither player won.";

        playSound("draw");
    }

    finalPlayerScore.textContent =
        playerPoints;

    finalComputerScore.textContent =
        computerPoints;

    saveStats();

    updateGameDisplay();

    setTimeout(() => {

        resultModal.classList.add(
            "show"
        );

        resultModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }, 450);

    rollBtn.disabled = true;

    rollBtn.textContent =
        "Match Complete";
}

// Start new game
function startNewGame() {

    currentRound = 1;

    playerPoints = 0;
    computerPoints = 0;

    currentStreak = 0;

    gameOver = false;
    rolling = false;

    playerDice.dataset.value = "";
    computerDice.dataset.value = "";

    playerResult.textContent =
        "Ready to roll";

    computerResult.textContent =
        "Waiting for you";

    roundMessage.textContent =
        "Roll the dice to start the battle.";

    roundHistory.innerHTML = `
        <div class="empty-history">
            No rounds played yet.
        </div>
    `;

    playerDiceArea.classList.remove(
        "winner",
        "loser",
        "draw"
    );

    computerDiceArea.classList.remove(
        "winner",
        "loser",
        "draw"
    );

    rollBtn.disabled = false;
    rollBtn.textContent =
        "Roll Dice";

    updateGameDisplay();

    closeResultModal();
}

// Save statistics
function saveStats() {

    localStorage.setItem(
        "diceBattleStats",
        JSON.stringify(stats)
    );
}

// Load statistics
function loadStats() {

    const savedStats =
        localStorage.getItem(
            "diceBattleStats"
        );

    if (!savedStats) {
        updateGameDisplay();
        return;
    }

    try {

        const data =
            JSON.parse(savedStats);

        stats = {
            gamesPlayed:
                Number(data.gamesPlayed) || 0,

            gamesWon:
                Number(data.gamesWon) || 0,

            totalWins:
                Number(data.totalWins) || 0,

            bestStreak:
                Number(data.bestStreak) || 0
        };

    } catch (error) {

        localStorage.removeItem(
            "diceBattleStats"
        );
    }

    updateGameDisplay();
}

// Toggle theme
function toggleTheme() {

    document.body.classList.toggle(
        "light-mode"
    );

    const isLightMode =
        document.body.classList.contains(
            "light-mode"
        );

    themeBtn.textContent =
        isLightMode ? "☾" : "☀";

    localStorage.setItem(
        "diceBattleTheme",
        isLightMode
            ? "light"
            : "dark"
    );
}

// Load theme
function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "diceBattleTheme"
        );

    if (savedTheme === "light") {

        document.body.classList.add(
            "light-mode"
        );

        themeBtn.textContent = "☾";

    } else {

        themeBtn.textContent = "☀";
    }
}

// Toggle sound
function toggleSound() {

    soundOn = !soundOn;

    soundBtn.textContent =
        soundOn ? "🔊" : "🔇";

    soundBtn.setAttribute(
        "aria-label",
        soundOn
            ? "Turn sound off"
            : "Turn sound on"
    );

    localStorage.setItem(
        "diceBattleSound",
        soundOn ? "on" : "off"
    );

    showToast(
        soundOn
            ? "Sound turned on."
            : "Sound turned off."
    );
}

// Load sound setting
function loadSound() {

    const savedSound =
        localStorage.getItem(
            "diceBattleSound"
        );

    soundOn =
        savedSound !== "off";

    soundBtn.textContent =
        soundOn ? "🔊" : "🔇";

    soundBtn.setAttribute(
        "aria-label",
        soundOn
            ? "Turn sound off"
            : "Turn sound on"
    );
}

// Close result modal
function closeResultModal() {

    resultModal.classList.remove(
        "show"
    );

    resultModal.setAttribute(
        "aria-hidden",
        "true"
    );
}

/* Event listeners */

rollBtn.addEventListener(
    "click",
    rollRound
);

newGameBtn.addEventListener(
    "click",
    () => {

        startNewGame();

        showToast(
            "New game started."
        );
    }
);

themeBtn.addEventListener(
    "click",
    toggleTheme
);

soundBtn.addEventListener(
    "click",
    toggleSound
);

closeModalBtn.addEventListener(
    "click",
    closeResultModal
);

playAgainBtn.addEventListener(
    "click",
    () => {

        startNewGame();

        showToast(
            "New game started."
        );
    }
);

// Close modal by clicking outside
resultModal.addEventListener(
    "click",
    event => {

        if (
            event.target === resultModal
        ) {
            closeResultModal();
        }
    }
);

// Close modal with Escape
document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeResultModal();
        }

        if (
            event.code === "Space" &&
            !event.target.matches(
                "button, input, select"
            )
        ) {
            event.preventDefault();

            if (!gameOver && !rolling) {
                rollRound();
            }
        }
    }
);

// Initialize application
loadTheme();
loadStats();
loadSound();
updateGameDisplay();