let currentPlayer = "X";
let gameOver = false;

let xScore = Number(localStorage.getItem("ticTacToeXScore")) || 0;
let oScore = Number(localStorage.getItem("ticTacToeOScore")) || 0;

const cells = document.querySelectorAll(".cell");
const status = document.querySelector(".status");

const xScoreDisplay = document.querySelector("#x-score");
const oScoreDisplay = document.querySelector("#o-score");

const restart = document.querySelector(".restart");
const resetScore = document.querySelector(".reset-score");

const themeButtons = document.querySelectorAll(".theme-button");

const cellLabels = [
    "Row 1, Column 1",
    "Row 1, Column 2",
    "Row 1, Column 3",
    "Row 2, Column 1",
    "Row 2, Column 2",
    "Row 2, Column 3",
    "Row 3, Column 1",
    "Row 3, Column 2",
    "Row 3, Column 3"
];

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


xScoreDisplay.textContent = xScore;
oScoreDisplay.textContent = oScore;


/* Play a move */

for (const cell of cells) {

    cell.addEventListener("click", function () {

        if (gameOver || cell.textContent !== "") {
            return;
        }

        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        const cellIndex = Array.from(cells).indexOf(cell);

        cell.setAttribute(
            "aria-label",
            cellLabels[cellIndex] + ", Player " + currentPlayer
        );


        const winner = checkWinner();

        if (winner) {

            updateScore(winner);

            status.textContent = "Player " + winner + " Wins!";
            gameOver = true;

            return;
        }


        if (checkDraw()) {

            status.textContent = "It's a Draw!";
            gameOver = true;

            return;
        }


        currentPlayer = currentPlayer === "X" ? "O" : "X";

        status.textContent =
            "Player " + currentPlayer + "'s Turn";
    });
}


/* Check winner */

function checkWinner() {

    for (const combination of winningCombinations) {

        const first = cells[combination[0]].textContent;
        const second = cells[combination[1]].textContent;
        const third = cells[combination[2]].textContent;

        if (
            first !== "" &&
            first === second &&
            second === third
        ) {

            cells[combination[0]].classList.add("winner");
            cells[combination[1]].classList.add("winner");
            cells[combination[2]].classList.add("winner");

            return first;
        }
    }

    return null;
}


/* Check draw */

function checkDraw() {

    for (const cell of cells) {

        if (cell.textContent === "") {
            return false;
        }
    }

    return true;
}


/* Update score */

function updateScore(winner) {

    if (winner === "X") {

        xScore++;
        xScoreDisplay.textContent = xScore;

        localStorage.setItem(
            "ticTacToeXScore",
            xScore
        );

    } else {

        oScore++;
        oScoreDisplay.textContent = oScore;

        localStorage.setItem(
            "ticTacToeOScore",
            oScore
        );
    }
}


/* Restart game */

restart.addEventListener("click", function () {

    for (let i = 0; i < cells.length; i++) {

        cells[i].textContent = "";

        cells[i].classList.remove("x");
        cells[i].classList.remove("o");
        cells[i].classList.remove("winner");

        cells[i].setAttribute(
            "aria-label",
            cellLabels[i]
        );
    }

    currentPlayer = "X";
    gameOver = false;

    status.textContent = "Player X's Turn";
});


/* Reset score */

resetScore.addEventListener("click", function () {

    xScore = 0;
    oScore = 0;

    xScoreDisplay.textContent = "0";
    oScoreDisplay.textContent = "0";

    localStorage.setItem("ticTacToeXScore", "0");
    localStorage.setItem("ticTacToeOScore", "0");

    restart.click();
});


/* Load saved theme */

const savedTheme =
    localStorage.getItem("ticTacToeTheme") || "green";

applyTheme(savedTheme);


/* Change theme */

for (const button of themeButtons) {

    button.addEventListener("click", function () {

        const selectedTheme =
            button.getAttribute("data-theme");

        applyTheme(selectedTheme);

        localStorage.setItem(
            "ticTacToeTheme",
            selectedTheme
        );
    });
}


/* Apply theme */

function applyTheme(theme) {

    document.body.classList.remove(
        "green",
        "blue",
        "dark"
    );

    document.body.classList.add(theme);


    for (const button of themeButtons) {
        button.classList.remove("active");
    }

    const selectedButton =
        document.querySelector(
            '.theme-button[data-theme="' + theme + '"]'
        );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }
}