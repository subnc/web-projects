let currentPlayer = 1;
let selectedHand = null;
let gameOver = false;

let player1 = {
    left: 1,
    right: 1
};

let player2 = {
    left: 1,
    right: 1
};


const hands = document.querySelectorAll(".hand");

const turnDisplay =
    document.querySelector("#turn-display");

const gameMessage =
    document.querySelector("#game-message");

const splitButton =
    document.querySelector("#split-button");

const restartButton =
    document.querySelector("#restart-button");

const gameCard =
    document.querySelector(".game-card");

const themeToggle =
    document.querySelector("#theme-toggle");

const themeIcon =
    document.querySelector("#theme-icon");


/* Load saved theme */

loadTheme();


/* Start game */

updateDisplay();


/* Handle hand clicks */

hands.forEach(function (hand) {

    hand.addEventListener("click", function () {

        if (gameOver) {
            return;
        }


        const player =
            Number(hand.dataset.player);

        const handName =
            hand.dataset.hand;


        if (player === currentPlayer) {

            selectOwnHand(player, handName);

        } else {

            attackOpponent(hand);
        }
    });
});


/* Select own hand */

function selectOwnHand(player, handName) {

    const value =
        getHandValue(player, handName);


    if (value === 0) {

        gameMessage.textContent =
            "That hand is inactive. Choose your other hand.";

        return;
    }


    clearSelection();


    selectedHand = {
        player: player,
        hand: handName
    };


    const hand =
        getHandElement(player, handName);


    hand.classList.add("selected");


    gameMessage.textContent =
        "Now select an opponent's live hand.";
}


/* Attack opponent */

function attackOpponent(targetHand) {

    if (!selectedHand) {

        gameMessage.textContent =
            "First select one of your own live hands.";

        return;
    }


    const targetPlayer =
        Number(targetHand.dataset.player);

    const targetHandName =
        targetHand.dataset.hand;


    const targetValue =
        getHandValue(
            targetPlayer,
            targetHandName
        );


    if (targetValue === 0) {

        gameMessage.textContent =
            "That hand is inactive. Choose another hand.";

        return;
    }


    const attackingValue =
        getHandValue(
            selectedHand.player,
            selectedHand.hand
        );


    let newValue =
        attackingValue + targetValue;


    if (newValue >= 5) {
        newValue = 0;
    }


    setHandValue(
        targetPlayer,
        targetHandName,
        newValue
    );


    targetHand.classList.add("attack");


    setTimeout(function () {
        targetHand.classList.remove("attack");
    }, 350);


    const winner =
        currentPlayer;

    const opponent =
        targetPlayer;


    clearSelection();

    updateDisplay();


    /* Check for winner */

    if (checkWinner(opponent)) {

        gameOver = true;

        gameCard.classList.add("game-over");
        gameMessage.classList.add("win-message");

        turnDisplay.textContent =
            "Player " + winner + " Wins";

        gameMessage.textContent =
            "Player " +
            winner +
            " wins! Both opponent hands are inactive.";

        splitButton.disabled = true;

        disableAllHands();

        return;
    }


    /* Change turn */

    currentPlayer =
        currentPlayer === 1 ? 2 : 1;


    updateDisplay();


    gameMessage.textContent =
        "Player " +
        currentPlayer +
        ": select one of your hands.";
}


/* Split hands */

splitButton.addEventListener("click", function () {

    if (gameOver) {
        return;
    }


    const player =
        currentPlayer === 1
            ? player1
            : player2;


    if (!canSplit(player)) {

        gameMessage.textContent =
            "Splitting is not possible with your current hands.";

        updateDisplay();

        return;
    }


    const total =
        player.left + player.right;


    /*
     * Keep the total number of fingers
     * and distribute them as evenly as possible.
     */

    player.left =
        Math.floor(total / 2);

    player.right =
        Math.ceil(total / 2);


    clearSelection();

    updateDisplay();


    const previousPlayer =
        currentPlayer;

    currentPlayer =
        currentPlayer === 1 ? 2 : 1;


    updateDisplay();


    gameMessage.textContent =
        "Player " +
        previousPlayer +
        " split the hands. Player " +
        currentPlayer +
        "'s turn.";
});


/* Check valid split */

function canSplit(player) {

    const total =
        player.left + player.right;


    if (total < 2 || total > 4) {
        return false;
    }


    const newLeft =
        Math.floor(total / 2);

    const newRight =
        Math.ceil(total / 2);


    /*
     * A split must actually change
     * the current hand distribution.
     */

    if (
        (player.left === newLeft &&
        player.right === newRight) ||

        (player.left === newRight &&
        player.right === newLeft)
    ) {
        return false;
    }


    return true;
}


/* Get hand value */

function getHandValue(player, handName) {

    const playerData =
        player === 1
            ? player1
            : player2;


    return playerData[handName];
}


/* Set hand value */

function setHandValue(player, handName, value) {

    const playerData =
        player === 1
            ? player1
            : player2;


    playerData[handName] = value;
}


/* Get hand element */

function getHandElement(player, handName) {

    return document.querySelector(
        '.hand[data-player="' +
        player +
        '"][data-hand="' +
        handName +
        '"]'
    );
}


/* Check winner */

function checkWinner(player) {

    const playerData =
        player === 1
            ? player1
            : player2;


    return (
        playerData.left === 0 &&
        playerData.right === 0
    );
}


/* Clear selected hand */

function clearSelection() {

    selectedHand = null;


    hands.forEach(function (hand) {
        hand.classList.remove("selected");
    });
}


/* Update display */

function updateDisplay() {

    updateHandDisplay(
        1,
        "left",
        player1.left
    );

    updateHandDisplay(
        1,
        "right",
        player1.right
    );

    updateHandDisplay(
        2,
        "left",
        player2.left
    );

    updateHandDisplay(
        2,
        "right",
        player2.right
    );


    if (!gameOver) {

        turnDisplay.textContent =
            "Player " + currentPlayer;
    }


    updatePlayerCards();


    const currentPlayerData =
        currentPlayer === 1
            ? player1
            : player2;


    splitButton.disabled =
        !canSplit(currentPlayerData);
}


/* Update hand display */

function updateHandDisplay(
    player,
    handName,
    value
) {

    const hand =
        getHandElement(player, handName);


    const count =
        hand.querySelector(".finger-count");

    const state =
        hand.querySelector(".hand-state");


    count.textContent = value;


    if (value === 0) {

        hand.classList.add("dead");

        hand.disabled = true;

        state.textContent =
            "Inactive";

    } else {

        hand.classList.remove("dead");

        hand.disabled = false;

        state.textContent =
            "Live";
    }
}


/* Update player cards */

function updatePlayerCards() {

    const playerOne =
        document.querySelector(".player-one");

    const playerTwo =
        document.querySelector(".player-two");


    const badgeOne =
        playerOne.querySelector(".player-badge");

    const badgeTwo =
        playerTwo.querySelector(".player-badge");


    playerOne.classList.remove("active-player");
    playerTwo.classList.remove("active-player");


    if (currentPlayer === 1) {

        playerOne.classList.add("active-player");

        badgeOne.textContent =
            "Your Turn";

        badgeTwo.textContent =
            "Waiting";

    } else {

        playerTwo.classList.add("active-player");

        badgeOne.textContent =
            "Waiting";

        badgeTwo.textContent =
            "Your Turn";
    }
}


/* Disable hands */

function disableAllHands() {

    hands.forEach(function (hand) {
        hand.disabled = true;
    });
}


/* Restart game */

restartButton.addEventListener("click", function () {

    player1.left = 1;
    player1.right = 1;

    player2.left = 1;
    player2.right = 1;


    currentPlayer = 1;
    selectedHand = null;
    gameOver = false;


    clearSelection();


    gameCard.classList.remove("game-over");

    gameMessage.classList.remove(
        "win-message"
    );


    updateDisplay();


    gameMessage.textContent =
        "Player 1: select one of your hands.";
});


/* Load saved theme */

function loadTheme() {

    const savedTheme =
        localStorage.getItem("chopsticksTheme") ||
        "professional";


    applyTheme(savedTheme);
}


/* Theme toggle */

themeToggle.addEventListener(
    "click",
    function () {

        const isDark =
            document.body.classList.contains("dark");


        if (isDark) {

            applyTheme("professional");

            localStorage.setItem(
                "chopsticksTheme",
                "professional"
            );

        } else {

            applyTheme("dark");

            localStorage.setItem(
                "chopsticksTheme",
                "dark"
            );
        }
    }
);


/* Apply theme */

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeIcon.textContent = "🌙";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to professional theme"
        );

    } else {

        document.body.classList.remove("dark");

        themeIcon.textContent = "☀️";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark theme"
        );
    }
}