const wordGrid = document.getElementById("wordGrid");
const wordList = document.getElementById("wordList");

const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");
const bestTimeElement = document.getElementById("bestTime");

const foundCountElement = document.getElementById("foundCount");
const remainingCountElement = document.getElementById("remainingCount");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const gamesPlayedElement =
    document.getElementById("gamesPlayed");

const gamesCompletedElement =
    document.getElementById("gamesCompleted");

const completionRateElement =
    document.getElementById("completionRate");

const startScreen =
    document.getElementById("startScreen");

const startGameBtn =
    document.getElementById("startGameBtn");

const gameSetup =
    document.getElementById("gameSetup");

const newGameBtn =
    document.getElementById("newGameBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const resumeBtn =
    document.getElementById("resumeBtn");

const pauseOverlay =
    document.getElementById("pauseOverlay");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const changeDifficultyBtn =
    document.getElementById("changeDifficultyBtn");

const gameMessage =
    document.getElementById("gameMessage");

const messageTitle =
    document.getElementById("messageTitle");

const messageText =
    document.getElementById("messageText");

const finalScore =
    document.getElementById("finalScore");

const finalTime =
    document.getElementById("finalTime");

const finalWords =
    document.getElementById("finalWords");

const bestMessage =
    document.getElementById("bestMessage");

const themeBtn =
    document.getElementById("themeBtn");

const soundBtn =
    document.getElementById("soundBtn");

const howToPlayBtn =
    document.getElementById("howToPlayBtn");

const howToModal =
    document.getElementById("howToModal");

const closeHowToBtn =
    document.getElementById("closeHowToBtn");

const modalStartBtn =
    document.getElementById("modalStartBtn");

const difficultyButtons =
    document.querySelectorAll(".difficulty-btn");


const difficultySettings = {

    easy: {
        size: 8,
        wordCount: 5,

        words: [
            "APPLE",
            "HOUSE",
            "MUSIC",
            "WATER",
            "HAPPY",
            "LIGHT",
            "GREEN",
            "PLANT"
        ]
    },

    medium: {
        size: 10,
        wordCount: 8,

        words: [
            "COMPUTER",
            "JAVASCRIPT",
            "BROWSER",
            "KEYBOARD",
            "WEBSITE",
            "PROGRAM",
            "NETWORK",
            "DIGITAL",
            "CODING",
            "SCREEN"
        ]
    },

    hard: {
        size: 12,
        wordCount: 12,

        words: [
            "ALGORITHM",
            "DATABASE",
            "FUNCTION",
            "VARIABLE",
            "SOFTWARE",
            "HARDWARE",
            "SECURITY",
            "INTERNET",
            "DEVELOPER",
            "FRAMEWORK",
            "LANGUAGE",
            "TECHNOLOGY"
        ]
    }
};


const difficultyBonus = {
    easy: 0,
    medium: 50,
    hard: 100
};


const BEST_SCORE_KEY =
    "wordSearchBestScores";

const GAME_STATS_KEY =
    "wordSearchGameStats";

const THEME_KEY =
    "wordSearchTheme";

const SOUND_KEY =
    "wordSearchSound";


let bestScores = {
    easy: 0,
    medium: 0,
    hard: 0
};


let gameStats = {
    easy: {
        played: 0,
        completed: 0,
        bestTime: null
    },

    medium: {
        played: 0,
        completed: 0,
        bestTime: null
    },

    hard: {
        played: 0,
        completed: 0,
        bestTime: null
    }
};


let currentDifficulty = "easy";

let gridSize = 8;
let grid = [];

let selectedWords = [];
let foundWords = [];

let score = 0;
let seconds = 0;
let timer = null;

let gameStarted = false;
let isPaused = false;

let isSelecting = false;
let selectionStart = null;
let currentSelection = [];

let soundEnabled = true;
let audioContext = null;


/* Load saved settings */
function loadSavedData() {

    const savedScores =
        localStorage.getItem(BEST_SCORE_KEY);

    if (savedScores) {
        try {
            const scores =
                JSON.parse(savedScores);

            bestScores.easy = scores.easy || 0;
            bestScores.medium = scores.medium || 0;
            bestScores.hard = scores.hard || 0;

        } catch {
            bestScores = {
                easy: 0,
                medium: 0,
                hard: 0
            };
        }
    }


    const savedTheme =
        localStorage.getItem(THEME_KEY);

    if (savedTheme === "light") {
        document.body.classList.add("light");
        themeBtn.textContent = "☀";
    }
}


/* Save best scores */
function saveBestScores() {

    localStorage.setItem(
        BEST_SCORE_KEY,
        JSON.stringify(bestScores)
    );
}


/* Load game statistics */
function loadGameStats() {

    const savedStats =
        localStorage.getItem(GAME_STATS_KEY);

    if (!savedStats) {
        return;
    }

    try {

        const saved =
            JSON.parse(savedStats);

        ["easy", "medium", "hard"].forEach(level => {

            if (saved[level]) {

                gameStats[level].played =
                    Number(saved[level].played) || 0;

                gameStats[level].completed =
                    Number(saved[level].completed) || 0;

                gameStats[level].bestTime =
                    saved[level].bestTime === null
                        ? null
                        : Number(saved[level].bestTime);
            }

        });

    } catch {
        gameStats = {
            easy: {
                played: 0,
                completed: 0,
                bestTime: null
            },

            medium: {
                played: 0,
                completed: 0,
                bestTime: null
            },

            hard: {
                played: 0,
                completed: 0,
                bestTime: null
            }
        };
    }
}


/* Save game statistics */
function saveGameStats() {

    localStorage.setItem(
        GAME_STATS_KEY,
        JSON.stringify(gameStats)
    );
}


/* Load sound preference */
function loadSoundPreference() {

    const savedSound =
        localStorage.getItem(SOUND_KEY);

    if (savedSound === "off") {
        soundEnabled = false;
        soundBtn.textContent = "🔇";
    }
}


/* Create audio context */
function getAudioContext() {

    if (!audioContext) {

        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    return audioContext;
}


/* Play a simple sound */
function playSound(type) {

    if (!soundEnabled) {
        return;
    }

    const context =
        getAudioContext();

    if (context.state === "suspended") {
        context.resume();
    }

    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);


    if (type === "correct") {
        oscillator.frequency.value = 620;
    }

    if (type === "wrong") {
        oscillator.frequency.value = 180;
    }

    if (type === "complete") {
        oscillator.frequency.value = 820;
    }


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


/* Format seconds as MM:SS */
function formatTime(totalSeconds) {

    const minutes =
        Math.floor(totalSeconds / 60);

    const remainingSeconds =
        totalSeconds % 60;

    return (
        `${String(minutes).padStart(2, "0")}:` +
        `${String(remainingSeconds).padStart(2, "0")}`
    );
}


/* Begin the selected game */
function beginGame() {

    startScreen.classList.add("hidden");
    gameSetup.classList.remove("hidden");

    startGame();
}


/* Start a new game */
function startGame() {

    const settings =
        difficultySettings[currentDifficulty];


    clearInterval(timer);


    gameMessage.classList.add("hidden");

    pauseOverlay.classList.add("hidden");

    pauseBtn.textContent = "Pause";


    gridSize = settings.size;

    score = 0;
    seconds = 0;

    foundWords = [];
    selectedWords = [];

    currentSelection = [];
    selectionStart = null;

    isSelecting = false;
    isPaused = false;
    gameStarted = true;


    gameStats[currentDifficulty].played++;

    saveGameStats();

    updateRecords();


    timer = setInterval(
        updateTimer,
        1000
    );


    createGrid();
    chooseWords();
    placeWords();
    fillEmptyCells();

    renderGrid();
    renderWordList();
    updateStats();
}


/* Create an empty grid */
function createGrid() {

    grid = [];

    for (let row = 0; row < gridSize; row++) {

        const newRow = [];

        for (let col = 0; col < gridSize; col++) {
            newRow.push("");
        }

        grid.push(newRow);
    }
}


/* Choose words */
function chooseWords() {

    const settings =
        difficultySettings[currentDifficulty];

    const shuffled =
        [...settings.words];

    shuffle(shuffled);

    selectedWords =
        shuffled.slice(
            0,
            settings.wordCount
        );
}


/* Shuffle an array */
function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array;
}


/* Place all words reliably */
function placeWords() {

    const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
    ];


    for (const word of selectedWords) {

        const possiblePlacements = [];


        for (let row = 0; row < gridSize; row++) {

            for (let col = 0; col < gridSize; col++) {

                for (const direction of directions) {

                    if (
                        canPlaceWord(
                            word,
                            row,
                            col,
                            direction[0],
                            direction[1]
                        )
                    ) {

                        possiblePlacements.push({
                            row,
                            col,
                            rowDirection: direction[0],
                            colDirection: direction[1]
                        });
                    }
                }
            }
        }


        if (possiblePlacements.length > 0) {

            const placement =
                possiblePlacements[
                    Math.floor(
                        Math.random() *
                        possiblePlacements.length
                    )
                ];


            addWordToGrid(
                word,
                placement.row,
                placement.col,
                placement.rowDirection,
                placement.colDirection
            );
        }
    }
}


/* Check whether a word fits */
function canPlaceWord(
    word,
    row,
    col,
    rowDirection,
    colDirection
) {

    for (let i = 0; i < word.length; i++) {

        const newRow =
            row + i * rowDirection;

        const newCol =
            col + i * colDirection;


        if (
            newRow < 0 ||
            newRow >= gridSize ||
            newCol < 0 ||
            newCol >= gridSize
        ) {
            return false;
        }


        const currentCell =
            grid[newRow][newCol];


        if (
            currentCell !== "" &&
            currentCell !== word[i]
        ) {
            return false;
        }
    }

    return true;
}


/* Add a word to the grid */
function addWordToGrid(
    word,
    row,
    col,
    rowDirection,
    colDirection
) {

    for (let i = 0; i < word.length; i++) {

        const newRow =
            row + i * rowDirection;

        const newCol =
            col + i * colDirection;

        grid[newRow][newCol] =
            word[i];
    }
}


/* Fill empty cells */
function fillEmptyCells() {

    const letters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    for (let row = 0; row < gridSize; row++) {

        for (let col = 0; col < gridSize; col++) {

            if (grid[row][col] === "") {

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        letters.length
                    );

                grid[row][col] =
                    letters[randomIndex];
            }
        }
    }
}


/* Display the grid */
function renderGrid() {

    wordGrid.innerHTML = "";

    wordGrid.style.gridTemplateColumns =
        `repeat(${gridSize}, 1fr)`;


    for (let row = 0; row < gridSize; row++) {

        for (let col = 0; col < gridSize; col++) {

            const cell =
                document.createElement("button");


            cell.type = "button";

            cell.className =
                "grid-cell";

            cell.textContent =
                grid[row][col];


            cell.dataset.row = row;
            cell.dataset.col = col;


            cell.setAttribute(
                "aria-label",
                `Row ${row + 1}, Column ${col + 1}, Letter ${grid[row][col]}`
            );


            wordGrid.appendChild(cell);
        }
    }


    addSelectionEvents();
}


/* Display the word list */
function renderWordList() {

    wordList.innerHTML = "";


    selectedWords.forEach(word => {

        const item =
            document.createElement("div");


        item.className =
            "word-item";

        item.textContent =
            word;

        item.dataset.word =
            word;


        item.setAttribute(
            "aria-label",
            `Word ${word}`
        );


        wordList.appendChild(item);
    });
}


/* Add selection events */
function addSelectionEvents() {

    const cells =
        document.querySelectorAll(".grid-cell");


    cells.forEach(cell => {

        cell.addEventListener(
            "mousedown",
            startSelection
        );

        cell.addEventListener(
            "mouseenter",
            continueSelection
        );


        cell.addEventListener(
            "touchstart",
            startSelection,
            {
                passive: false
            }
        );


        cell.addEventListener(
            "touchmove",
            handleTouchMove,
            {
                passive: false
            }
        );
    });
}


/* Start selecting */
function startSelection(event) {

    event.preventDefault();


    if (
        !gameStarted ||
        isPaused
    ) {
        return;
    }


    const cell =
        event.currentTarget;


    selectionStart = {
        row: Number(cell.dataset.row),
        col: Number(cell.dataset.col)
    };


    isSelecting = true;


    currentSelection = [
        selectionStart
    ];


    showSelection();
}


/* Continue mouse selection */
function continueSelection(event) {

    if (
        !isSelecting ||
        isPaused ||
        !gameStarted
    ) {
        return;
    }


    const cell =
        event.currentTarget;


    const row =
        Number(cell.dataset.row);

    const col =
        Number(cell.dataset.col);


    updateSelection(
        row,
        col
    );
}


/* Handle touch movement */
function handleTouchMove(event) {

    event.preventDefault();


    if (
        !isSelecting ||
        isPaused ||
        !gameStarted
    ) {
        return;
    }


    const touch =
        event.touches[0];


    const element =
        document.elementFromPoint(
            touch.clientX,
            touch.clientY
        );


    if (
        !element ||
        !element.classList.contains("grid-cell")
    ) {
        return;
    }


    const row =
        Number(element.dataset.row);

    const col =
        Number(element.dataset.col);


    updateSelection(
        row,
        col
    );
}


/* Update selection */
function updateSelection(
    endRow,
    endCol
) {

    if (!selectionStart) {
        return;
    }


    const startRow =
        selectionStart.row;

    const startCol =
        selectionStart.col;


    const rowDifference =
        endRow - startRow;

    const colDifference =
        endCol - startCol;


    const rowStep =
        Math.sign(rowDifference);

    const colStep =
        Math.sign(colDifference);


    const isStraightLine =
        rowDifference === 0 ||
        colDifference === 0 ||
        Math.abs(rowDifference) ===
        Math.abs(colDifference);


    if (!isStraightLine) {
        return;
    }


    const length =
        Math.max(
            Math.abs(rowDifference),
            Math.abs(colDifference)
        ) + 1;


    currentSelection = [];


    for (let i = 0; i < length; i++) {

        currentSelection.push({
            row:
                startRow +
                i * rowStep,

            col:
                startCol +
                i * colStep
        });
    }


    showSelection();
}


/* Show selection */
function showSelection() {

    document
        .querySelectorAll(".grid-cell")
        .forEach(cell => {
            cell.classList.remove("selected");
        });


    currentSelection.forEach(position => {

        const cell =
            getCell(
                position.row,
                position.col
            );


        if (
            cell &&
            !cell.classList.contains("found")
        ) {
            cell.classList.add("selected");
        }
    });
}


/* Get a grid cell */
function getCell(row, col) {

    return document.querySelector(
        `.grid-cell[data-row="${row}"][data-col="${col}"]`
    );
}


/* Finish selection */
function endSelection() {

    if (!isSelecting) {
        return;
    }


    isSelecting = false;


    if (
        !isPaused &&
        gameStarted
    ) {
        checkSelectedWord();
    }


    selectionStart = null;
    currentSelection = [];


    document
        .querySelectorAll(".grid-cell")
        .forEach(cell => {
            cell.classList.remove("selected");
        });
}


/* Check selected word */
function checkSelectedWord() {

    if (currentSelection.length < 2) {
        return;
    }


    let word = "";


    currentSelection.forEach(position => {

        word +=
            grid[
                position.row
            ][
                position.col
            ];
    });


    const reversedWord =
        word
            .split("")
            .reverse()
            .join("");


    let matchedWord = null;


    if (
        selectedWords.includes(word) &&
        !foundWords.includes(word)
    ) {

        matchedWord = word;

    } else if (
        selectedWords.includes(reversedWord) &&
        !foundWords.includes(reversedWord)
    ) {

        matchedWord =
            reversedWord;
    }


    if (matchedWord) {
        handleCorrectWord(matchedWord);
    } else {
        showWrongSelection();
    }
}


/* Handle correct word */
function handleCorrectWord(word) {

    foundWords.push(word);

    playSound("correct");


    const wordPoints =
        word.length * 10;


    const timeBonus =
        Math.max(
            0,
            100 - Math.floor(seconds / 2)
        );


    score +=
        wordPoints +
        timeBonus;


    if (
        score >
        bestScores[currentDifficulty]
    ) {

        bestScores[currentDifficulty] =
            score;

        saveBestScores();
    }


    markFoundCells();

    updateWordList();

    updateStats();


    if (
        foundWords.length ===
        selectedWords.length
    ) {
        finishGame();
    }
}


/* Mark found cells */
function markFoundCells() {

    currentSelection.forEach(position => {

        const cell =
            getCell(
                position.row,
                position.col
            );


        if (cell) {
            cell.classList.add("found");
        }
    });
}


/* Show wrong selection */
function showWrongSelection() {

    playSound("wrong");


    currentSelection.forEach(position => {

        const cell =
            getCell(
                position.row,
                position.col
            );


        if (cell) {

            cell.classList.add("wrong");


            setTimeout(() => {

                cell.classList.remove(
                    "wrong"
                );

            }, 300);
        }
    });
}


/* Update word list */
function updateWordList() {

    const items =
        document.querySelectorAll(
            ".word-item"
        );


    items.forEach(item => {

        const word =
            item.dataset.word;


        item.classList.toggle(
            "found",
            foundWords.includes(word)
        );
    });
}


/* Update timer */
function updateTimer() {

    if (
        !gameStarted ||
        isPaused
    ) {
        return;
    }


    seconds++;


    timerElement.textContent =
        formatTime(seconds);
}


/* Update game statistics */
function updateStats() {

    const found =
        foundWords.length;

    const total =
        selectedWords.length;


    const progress =
        total === 0
            ? 0
            : Math.round(
                (found / total) * 100
            );


    scoreElement.textContent =
        score;


    bestScoreElement.textContent =
        bestScores[currentDifficulty];


    foundCountElement.textContent =
        `${found} / ${total}`;


    remainingCountElement.textContent =
        `${total - found} left`;


    progressFill.style.width =
        `${progress}%`;


    progressText.textContent =
        `${progress}%`;
}


/* Update records */
function updateRecords() {

    const stats =
        gameStats[currentDifficulty];


    gamesPlayedElement.textContent =
        stats.played;


    gamesCompletedElement.textContent =
        stats.completed;


    const rate =
        stats.played === 0
            ? 0
            : Math.round(
                (stats.completed /
                    stats.played) * 100
            );


    completionRateElement.textContent =
        `${rate}%`;


    bestTimeElement.textContent =
        stats.bestTime === null
            ? "--:--"
            : formatTime(
                stats.bestTime
            );
}


/* Pause the game */
function pauseGame() {

    if (!gameStarted || isPaused) {
        return;
    }


    isPaused = true;

    clearInterval(timer);

    pauseOverlay.classList.remove(
        "hidden"
    );

    pauseBtn.textContent =
        "Resume";
}


/* Resume the game */
function resumeGame() {

    if (!gameStarted || !isPaused) {
        return;
    }


    isPaused = false;

    pauseOverlay.classList.add(
        "hidden"
    );


    timer = setInterval(
        updateTimer,
        1000
    );


    pauseBtn.textContent =
        "Pause";
}


/* Finish game */
function finishGame() {

    gameStarted = false;

    isPaused = false;

    clearInterval(timer);

    pauseOverlay.classList.add(
        "hidden"
    );


    const currentStats =
        gameStats[currentDifficulty];


    const previousBestScore =
        bestScores[currentDifficulty];


    const previousBestTime =
        currentStats.bestTime;


    score +=
        difficultyBonus[currentDifficulty];


    const newBestScore =
        score > previousBestScore;


    const newBestTime =
        previousBestTime === null ||
        seconds < previousBestTime;


    if (newBestScore) {

        bestScores[currentDifficulty] =
            score;

        saveBestScores();
    }


    if (newBestTime) {
        currentStats.bestTime =
            seconds;
    }


    currentStats.completed++;


    saveGameStats();

    updateRecords();

    updateStats();


    playSound("complete");


    finalScore.textContent =
        score;


    finalTime.textContent =
        formatTime(seconds);


    finalWords.textContent =
        `${foundWords.length} / ${selectedWords.length}`;


    if (
        newBestScore &&
        newBestTime
    ) {

        messageTitle.textContent =
            "New Record!";

        bestMessage.textContent =
            "🏆 New best score and best time!";

    } else if (newBestScore) {

        messageTitle.textContent =
            "New Best Score!";

        bestMessage.textContent =
            "🏆 You achieved a new best score!";

    } else if (newBestTime) {

        messageTitle.textContent =
            "New Best Time!";

        bestMessage.textContent =
            "⚡ You achieved a new best time!";

    } else {

        messageTitle.textContent =
            "Congratulations!";

        bestMessage.textContent =
            `Best score: ${bestScores[currentDifficulty]} · ` +
            `Best time: ${formatTime(currentStats.bestTime)}`;
    }


    messageText.textContent =
        "You found all the hidden words.";


    gameMessage.classList.remove(
        "hidden"
    );
}


/* Change difficulty */
function setDifficulty(level) {

    currentDifficulty = level;


    difficultyButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.level === level
        );
    });


    updateStats();
    updateRecords();
}


/* Difficulty buttons */
difficultyButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            setDifficulty(
                button.dataset.level
            );


            if (
                !startScreen.classList.contains(
                    "hidden"
                )
            ) {
                return;
            }


            startGame();
        }
    );
});


/* Start button */
startGameBtn.addEventListener(
    "click",
    () => {
        beginGame();
    }
);


/* New Game */
newGameBtn.addEventListener(
    "click",
    () => {
        startGame();
    }
);


/* Play Again */
playAgainBtn.addEventListener(
    "click",
    () => {
        startGame();
    }
);


/* Pause */
pauseBtn.addEventListener(
    "click",
    () => {

        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
);


/* Resume */
resumeBtn.addEventListener(
    "click",
    () => {
        resumeGame();
    }
);


/* Change difficulty */
changeDifficultyBtn.addEventListener(
    "click",
    () => {

        clearInterval(timer);

        gameStarted = false;
        isPaused = false;

        gameMessage.classList.add(
            "hidden"
        );

        gameSetup.classList.add(
            "hidden"
        );

        startScreen.classList.remove(
            "hidden"
        );

        updateStats();
        updateRecords();
    }
);


/* Open instructions */
howToPlayBtn.addEventListener(
    "click",
    () => {

        howToModal.classList.remove(
            "hidden"
        );
    }
);


/* Close instructions */
closeHowToBtn.addEventListener(
    "click",
    () => {

        howToModal.classList.add(
            "hidden"
        );
    }
);


/* Start from instructions */
modalStartBtn.addEventListener(
    "click",
    () => {

        howToModal.classList.add(
            "hidden"
        );

        beginGame();
    }
);


/* Close modal outside */
howToModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            howToModal
        ) {

            howToModal.classList.add(
                "hidden"
            );
        }
    }
);


/* Theme */
themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const isLight =
            document.body.classList.contains(
                "light"
            );


        themeBtn.textContent =
            isLight ? "☀" : "☾";


        localStorage.setItem(
            THEME_KEY,
            isLight ? "light" : "dark"
        );
    }
);


/* Sound */
soundBtn.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;


        soundBtn.textContent =
            soundEnabled
                ? "🔊"
                : "🔇";


        localStorage.setItem(
            SOUND_KEY,
            soundEnabled
                ? "on"
                : "off"
        );


        if (soundEnabled) {
            playSound("correct");
        }
    }
);


/* Keyboard controls */
document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            howToModal.classList.add(
                "hidden"
            );
        }


        if (
            event.code === "Space" &&
            gameStarted
        ) {

            event.preventDefault();

            if (isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        }
    }
);


/* End mouse selection */
document.addEventListener(
    "mouseup",
    endSelection
);


/* End touch selection */
document.addEventListener(
    "touchend",
    endSelection
);


/* Prevent selection from behaving strangely */
wordGrid.addEventListener(
    "mouseleave",
    () => {

        if (isSelecting) {
            showSelection();
        }
    }
);


/* Load saved data */
loadSavedData();

loadGameStats();

loadSoundPreference();

updateStats();

updateRecords();