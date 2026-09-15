/* Card Symbols */

const symbols = [
    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🍒",
    "🥝",
    "🍍"
];

/* Game Variables */

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let mistakes = 0;
let seconds = 0;

let timerInterval = null;
let gameStarted = false;

let numberOfPairs = 4;

let soundEnabled =
    localStorage.getItem("soundEnabled") !== "false";

let bestScore = null;
let audioContext = null;

/* DOM Elements */

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const gameArea =
    document.getElementById("gameArea");

const gameBoard =
    document.getElementById("gameBoard");

const restartButton =
    document.getElementById("restartButton");

const playAgainButton =
    document.getElementById("playAgainButton");

const winModal =
    document.getElementById("winModal");

const themeButton =
    document.getElementById("themeButton");

const soundButton =
    document.getElementById("soundButton");

const changeDifficultyButton =
    document.getElementById(
        "changeDifficultyButton"
    );

const cancelDifficultyButton =
    document.getElementById(
        "cancelDifficultyButton"
    );

const difficultyModal =
    document.getElementById("difficultyModal");

const startDifficultyButtons =
    document.querySelectorAll(
        ".start-difficulty-button"
    );

const modalDifficultyButtons =
    document.querySelectorAll(
        ".modal-difficulty-button"
    );

const difficultyNames = {
    4: "Easy",
    6: "Medium",
    8: "Hard"
};

/* Load Best Score */

function loadBestScore() {

    bestScore =
        localStorage.getItem(
            "bestScore-" + numberOfPairs
        ) || null;
}

/* Display Best Score */

function displayBestScore() {

    const bestScoreElement =
        document.getElementById("bestScore");

    if (bestScore) {

        bestScoreElement.textContent =
            bestScore + " moves";

    } else {

        bestScoreElement.textContent = "-";
    }
}

/* Update Difficulty */

function updateDifficulty() {

    document.getElementById(
        "currentDifficulty"
    ).textContent =
        difficultyNames[numberOfPairs];

    startDifficultyButtons.forEach(
        function(button) {

            button.classList.toggle(
                "active",
                Number(button.dataset.pairs) ===
                numberOfPairs
            );
        }
    );

    modalDifficultyButtons.forEach(
        function(button) {

            button.classList.toggle(
                "active",
                Number(button.dataset.pairs) ===
                numberOfPairs
            );
        }
    );
}

/* Create Cards */

function createCards() {

    loadBestScore();

    const selectedSymbols =
        symbols.slice(0, numberOfPairs);

    cards = [
        ...selectedSymbols,
        ...selectedSymbols
    ];

    shuffleCards();
    displayCards();
    displayBestScore();
    updateProgress();
}

/* Shuffle Cards */

function shuffleCards() {

    for (
        let i = cards.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            cards[i],
            cards[randomIndex]
        ] = [
            cards[randomIndex],
            cards[i]
        ];
    }
}

/* Start Timer */

function startTimer() {

    if (gameStarted) {
        return;
    }

    gameStarted = true;

    timerInterval =
        setInterval(
            function() {

                seconds++;

                updateTimer();

            },
            1000
        );
}

/* Update Timer */

function updateTimer() {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;

    const formattedMinutes =
        String(minutes).padStart(2, "0");

    const formattedSeconds =
        String(remainingSeconds).padStart(2, "0");

    document.getElementById(
        "timer"
    ).textContent =
        formattedMinutes +
        ":" +
        formattedSeconds;
}

/* Display Cards */

function displayCards() {

    gameBoard.innerHTML = "";

    cards.forEach(
        function(symbol, index) {

            const card =
                document.createElement("button");

            card.className = "card";

            card.dataset.symbol = symbol;
            card.dataset.index = index;

            card.setAttribute(
                "aria-label",
                "Hidden memory card"
            );

            card.innerHTML = `
                <span class="card-front">?</span>
                <span class="card-back">${symbol}</span>
            `;

            card.addEventListener(
                "click",
                function() {
                    flipCard(card);
                }
            );

            gameBoard.appendChild(card);
        }
    );
}

/* Flip Card */

function flipCard(card) {

    if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.classList.add("flipped");

    card.setAttribute(
        "aria-label",
        "Memory card " +
        card.dataset.symbol
    );

    playSound("flip");

    if (!gameStarted) {
        startTimer();
    }

    if (!firstCard) {

        firstCard = card;

        return;
    }

    secondCard = card;

    checkMatch();
}

/* Check Matching Cards */

function checkMatch() {

    moves++;

    document.getElementById(
        "moves"
    ).textContent = moves;

    const isMatch =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;

    if (isMatch) {

        playSound("match");

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        resetCards();

        updateProgress();

        checkGameComplete();

    } else {

        playSound("wrong");

        mistakes++;

        document.getElementById(
            "mistakes"
        ).textContent = mistakes;

        lockBoard = true;

        setTimeout(
            function() {

                firstCard.classList.remove(
                    "flipped"
                );

                secondCard.classList.remove(
                    "flipped"
                );

                firstCard.setAttribute(
                    "aria-label",
                    "Hidden memory card"
                );

                secondCard.setAttribute(
                    "aria-label",
                    "Hidden memory card"
                );

                resetCards();

            },
            800
        );
    }
}

/* Reset Selected Cards */

function resetCards() {

    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

/* Update Progress */

function updateProgress() {

    const matchedCards =
        document.querySelectorAll(
            ".card.matched"
        );

    const matchedPairs =
        matchedCards.length / 2;

    const progress =
        (matchedPairs / numberOfPairs) * 100;

    document.getElementById(
        "progressText"
    ).textContent =
        matchedPairs +
        " / " +
        numberOfPairs +
        " pairs";

    document.getElementById(
        "progressFill"
    ).style.width =
        progress + "%";
}

/* Check Game Completion */

function checkGameComplete() {

    const matchedCards =
        document.querySelectorAll(
            ".card.matched"
        );

    if (
        matchedCards.length ===
        cards.length
    ) {

        clearInterval(timerInterval);

        if (
            !bestScore ||
            moves < Number(bestScore)
        ) {

            bestScore = moves;

            localStorage.setItem(
                "bestScore-" + numberOfPairs,
                bestScore
            );
        }

        displayBestScore();

        document.getElementById(
            "finalMoves"
        ).textContent = moves;

        document.getElementById(
            "finalMistakes"
        ).textContent = mistakes;

        document.getElementById(
            "finalTime"
        ).textContent =
            document.getElementById(
                "timer"
            ).textContent;

        document.getElementById(
            "finalBest"
        ).textContent =
            bestScore + " moves";

        const winMessage =
            document.getElementById(
                "winMessage"
            );

        if (mistakes === 0) {

            winMessage.textContent =
                "⭐ Perfect Game! Amazing memory!";

        } else if (mistakes <= 2) {

            winMessage.textContent =
                "Excellent! Very few mistakes.";

        } else if (mistakes <= 5) {

            winMessage.textContent =
                "Good job! Keep practicing.";

        } else {

            winMessage.textContent =
                "Game complete! Try to improve your score.";
        }

        playSound("win");

        winModal.classList.add("show");
    }
}

/* Reset Game */

function resetGame() {

    clearInterval(timerInterval);

    moves = 0;
    mistakes = 0;
    seconds = 0;

    gameStarted = false;

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    document.getElementById(
        "moves"
    ).textContent = "0";

    document.getElementById(
        "mistakes"
    ).textContent = "0";

    document.getElementById(
        "timer"
    ).textContent = "00:00";

    createCards();
}

/* Start Game */

startButton.addEventListener(
    "click",
    function() {

        startScreen.classList.add(
            "hidden"
        );

        gameArea.classList.remove(
            "hidden"
        );

        resetGame();
    }
);

/* Restart Game */

restartButton.addEventListener(
    "click",
    function() {

        resetGame();
    }
);

/* Play Again */

playAgainButton.addEventListener(
    "click",
    function() {

        winModal.classList.remove(
            "show"
        );

        resetGame();
    }
);

/* Start Screen Difficulty */

startDifficultyButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                numberOfPairs =
                    Number(
                        button.dataset.pairs
                    );

                updateDifficulty();

                loadBestScore();

                displayBestScore();
            }
        );
    }
);

/* Open Difficulty Modal */

changeDifficultyButton.addEventListener(
    "click",
    function() {

        updateDifficulty();

        difficultyModal.classList.add(
            "show"
        );
    }
);

/* Modal Difficulty */

modalDifficultyButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                numberOfPairs =
                    Number(
                        button.dataset.pairs
                    );

                updateDifficulty();

                difficultyModal.classList.remove(
                    "show"
                );

                resetGame();
            }
        );
    }
);

/* Cancel Difficulty */

cancelDifficultyButton.addEventListener(
    "click",
    function() {

        difficultyModal.classList.remove(
            "show"
        );
    }
);

/* Close Difficulty Modal */

difficultyModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            difficultyModal
        ) {

            difficultyModal.classList.remove(
                "show"
            );
        }
    }
);

/* Close Win Modal */

winModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === winModal
        ) {

            winModal.classList.remove(
                "show"
            );
        }
    }
);

/* Keyboard Controls */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            difficultyModal.classList.remove(
                "show"
            );

            winModal.classList.remove(
                "show"
            );
        }
    }
);

/* Sound */

function playSound(type) {

    if (!soundEnabled) {
        return;
    }

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) {
        return;
    }

    if (!audioContext) {

        audioContext =
            new AudioContext();
    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();
    }

    const oscillator =
        audioContext.createOscillator();

    const gainNode =
        audioContext.createGain();

    oscillator.connect(gainNode);

    gainNode.connect(
        audioContext.destination
    );

    if (type === "flip") {

        oscillator.frequency.value = 350;
        gainNode.gain.value = 0.05;

    } else if (type === "match") {

        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.08;

    } else if (type === "wrong") {

        oscillator.frequency.value = 180;
        gainNode.gain.value = 0.06;

    } else if (type === "win") {

        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
    }

    oscillator.type = "sine";

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.2
    );

    oscillator.stop(
        audioContext.currentTime + 0.2
    );
}

/* Sound Toggle */

function updateSoundButton() {

    soundButton.textContent =
        soundEnabled
            ? "🔊"
            : "🔇";

    soundButton.setAttribute(
        "aria-label",
        soundEnabled
            ? "Turn sound off"
            : "Turn sound on"
    );
}

soundButton.addEventListener(
    "click",
    function() {

        soundEnabled = !soundEnabled;

        localStorage.setItem(
            "soundEnabled",
            soundEnabled
        );

        updateSoundButton();
    }
);

updateSoundButton();

/* Theme */

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-theme"
    );

    themeButton.textContent = "☀️";

    themeButton.setAttribute(
        "aria-label",
        "Switch to light theme"
    );
}

/* Theme Toggle */

themeButton.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark-theme"
        );

        const isDark =
            document.body.classList.contains(
                "dark-theme"
            );

        if (isDark) {

            themeButton.textContent = "☀️";

            themeButton.setAttribute(
                "aria-label",
                "Switch to light theme"
            );

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeButton.textContent = "🌙";

            themeButton.setAttribute(
                "aria-label",
                "Switch to dark theme"
            );

            localStorage.setItem(
                "theme",
                "light"
            );
        }
    }
);

/* Initial Setup */

updateDifficulty();
loadBestScore();
displayBestScore();
createCards();