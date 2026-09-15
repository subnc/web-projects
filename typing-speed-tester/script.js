/* Application State */

let time = 30;
let startTime = 30;
let timer = null;
let difficulty = "easy";
let testFinished = false;


/* Typing Passages */

const texts = {

    easy: [

        "The quick brown fox jumps over the lazy dog.",

        "Practice makes a person better at everything they do.",

        "Learning new skills takes time and regular practice.",

        "Good typing skills help you work faster every day."

    ],


    medium: [

        "Learning JavaScript is fun and helps you build interactive websites. Practice regularly to improve your coding skills and understand how web applications work.",

        "Web development combines HTML CSS and JavaScript to create useful and interactive websites. With practice, you can build better projects and improve your programming skills.",

        "Technology is changing the way people learn work and communicate. Learning new technologies can help students develop useful skills for their future careers."

    ],


    hard: [

        "Web development is an important part of modern technology. HTML provides the structure of a webpage while CSS controls its appearance and JavaScript adds interactivity. By practicing regularly, developers can improve their problem solving skills and create better applications.",

        "Programming requires patience practice and logical thinking. When learning JavaScript, it is important to understand variables functions conditions loops and events. Building small projects is an excellent way to improve programming knowledge and gain confidence while developing real world applications.",

        "Modern websites are designed to provide fast interactive and user friendly experiences. Developers use different technologies to create applications that work across computers tablets and mobile devices. Continuous learning and regular practice help developers understand new tools and improve their ability to solve complex problems."

    ]

};


let originalText = "";


/* DOM Elements */

const input =
    document.getElementById("input");

const timerDisplay =
    document.getElementById("timer");

const wpmDisplay =
    document.getElementById("wpm");

const bestWpmDisplay =
    document.getElementById("bestWpm");

const accuracyDisplay =
    document.getElementById("accuracy");

const wordsDisplay =
    document.getElementById("words");

const charactersDisplay =
    document.getElementById("characters");

const restartButton =
    document.getElementById("restart");

const result =
    document.getElementById("result");

const finalWpm =
    document.getElementById("finalWpm");

const finalAccuracy =
    document.getElementById("finalAccuracy");

const themeToggle =
    document.getElementById("themeToggle");

const progressBar =
    document.getElementById("progressBar");

const performanceMessage =
    document.getElementById("performanceMessage");


/* Display a passage based on difficulty */

function displayText() {

    const passages =
        texts[difficulty];

    const randomNumber =
        Math.floor(
            Math.random() *
            passages.length
        );

    originalText =
        passages[randomNumber];

    const textElement =
        document.getElementById("text");

    textElement.innerHTML = "";

    for (
        let i = 0;
        i < originalText.length;
        i++
    ) {

        const span =
            document.createElement("span");

        span.textContent =
            originalText[i];

        textElement.appendChild(span);
    }

    checkTyping();
}


/* Start the countdown timer */

function startTimer() {

    timer =
        setInterval(function () {

            time--;

            updateTimer();

            if (time <= 0) {

                finishTest();
            }

        }, 1000);
}


/* Display timer and progress */

function updateTimer() {

    const minutes =
        Math.floor(time / 60);

    const seconds =
        time % 60;

    const formattedSeconds =
        seconds < 10
            ? "0" + seconds
            : seconds;

    timerDisplay.textContent =
        minutes +
        ":" +
        formattedSeconds;

    const progress =
        (time / startTime) * 100;

    progressBar.style.width =
        progress + "%";

    if (time <= 10 && time > 0) {

        timerDisplay.classList.add(
            "warning"
        );

    } else {

        timerDisplay.classList.remove(
            "warning"
        );
    }
}


/* Count correctly typed characters */

function getCorrectCharacters() {

    const typedText =
        input.value;

    let correct = 0;

    for (
        let i = 0;
        i < typedText.length;
        i++
    ) {

        if (
            typedText[i] ===
            originalText[i]
        ) {

            correct++;
        }
    }

    return correct;
}


/* Calculate standard words per minute */

function calculateWPM() {

    const typedText =
        input.value;

    if (typedText.length === 0) {

        wpmDisplay.textContent = 0;

        return;
    }

    const correctCharacters =
        getCorrectCharacters();

    const timeUsed =
        startTime - time;

    if (timeUsed > 0) {

        const minutes =
            timeUsed / 60;

        const wpm =
            Math.round(
                (correctCharacters / 5) /
                minutes
            );

        wpmDisplay.textContent =
            wpm;
    }
}


/* Calculate typing accuracy */

function calculateAccuracy() {

    const typedText =
        input.value;

    if (typedText.length === 0) {

        accuracyDisplay.textContent =
            100;

        return;
    }

    const correct =
        getCorrectCharacters();

    const accuracy =
        Math.round(
            (correct /
                typedText.length) *
            100
        );

    accuracyDisplay.textContent =
        accuracy;
}


/* Highlight typing progress */

function checkTyping() {

    const typedText =
        input.value;

    const characters =
        document.querySelectorAll(
            "#text span"
        );

    for (
        let i = 0;
        i < characters.length;
        i++
    ) {

        characters[i]
            .classList
            .remove(
                "current-character"
            );

        if (i < typedText.length) {

            if (
                typedText[i] ===
                originalText[i]
            ) {

                characters[i].style.color =
                    "var(--correct)";

            } else {

                characters[i].style.color =
                    "var(--incorrect)";
            }

        } else {

            characters[i].style.color =
                "var(--text-secondary)";
        }
    }


    if (
        typedText.length <
        originalText.length
    ) {

        characters[
            typedText.length
        ].classList.add(
            "current-character"
        );
    }
}


/* Update word and character counts */

function updateCounts() {

    const typedText =
        input.value;

    const characters =
        typedText.length;

    const words =
        typedText.trim() === ""
            ? 0
            : typedText
                .trim()
                .split(/\s+/)
                .length;

    wordsDisplay.textContent =
        words;

    charactersDisplay.textContent =
        characters +
        " characters";
}


/* Save the highest WPM */

function updateBestWPM() {

    const currentWPM =
        Number(
            wpmDisplay.textContent
        );

    const bestWPM =
        Number(
            localStorage.getItem(
                "bestWPM"
            )
        ) || 0;

    if (currentWPM > bestWPM) {

        localStorage.setItem(
            "bestWPM",
            currentWPM
        );

        bestWpmDisplay.textContent =
            currentWPM;

    } else {

        bestWpmDisplay.textContent =
            bestWPM;
    }
}


/* Display performance message */

function showPerformanceMessage() {

    const wpm =
        Number(
            wpmDisplay.textContent
        );

    if (wpm >= 50) {

        performanceMessage.textContent =
            "🚀 Excellent! You are a fast typist.";

    } else if (wpm >= 35) {

        performanceMessage.textContent =
            "👏 Great job! Keep improving.";

    } else if (wpm >= 20) {

        performanceMessage.textContent =
            "💪 Good effort! Keep practicing.";

    } else {

        performanceMessage.textContent =
            "📚 Keep practicing and you will improve.";
    }
}


/* Finish the typing test */

function finishTest() {

    if (testFinished) {

        return;
    }

    testFinished = true;

    clearInterval(timer);

    timer = null;

    time =
        Math.max(
            time,
            0
        );

    updateTimer();

    calculateWPM();

    calculateAccuracy();

    updateCounts();

    input.disabled = true;

    updateBestWPM();

    finalWpm.textContent =
        wpmDisplay.textContent;

    finalAccuracy.textContent =
        accuracyDisplay.textContent;

    showPerformanceMessage();

    result.style.display =
        "block";
}


/* Set the difficulty level */

function setDifficulty(level) {

    difficulty = level;

    testFinished = false;

    clearInterval(timer);

    timer = null;

    if (level === "easy") {

        time = 30;

        startTime = 30;

    } else if (level === "medium") {

        time = 60;

        startTime = 60;

    } else if (level === "hard") {

        time = 120;

        startTime = 120;
    }

    updateTimer();

    input.value = "";

    input.disabled = false;

    wpmDisplay.textContent =
        0;

    accuracyDisplay.textContent =
        100;

    wordsDisplay.textContent =
        0;

    charactersDisplay.textContent =
        "0 characters";

    result.style.display =
        "none";

    updateDifficultyButtons();

    displayText();

    input.focus();
}


/* Update active difficulty button */

function updateDifficultyButtons() {

    const buttons =
        document.querySelectorAll(
            ".difficulty-btn"
        );

    buttons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );


    if (difficulty === "easy") {

        buttons[0].classList.add(
            "active"
        );

    } else if (difficulty === "medium") {

        buttons[1].classList.add(
            "active"
        );

    } else if (difficulty === "hard") {

        buttons[2].classList.add(
            "active"
        );
    }
}


/* Handle user typing */

input.addEventListener(
    "input",
    function () {

        if (testFinished) {

            return;
        }

        if (timer === null) {

            startTimer();
        }

        calculateWPM();

        calculateAccuracy();

        checkTyping();

        updateCounts();

        if (
            input.value ===
            originalText
        ) {

            finishTest();
        }

    }
);


/* Restart the typing test */

restartButton.addEventListener(
    "click",
    function () {

        clearInterval(timer);

        testFinished = false;

        time =
            startTime;

        timer = null;

        input.value = "";

        input.disabled = false;

        updateTimer();

        wpmDisplay.textContent =
            0;

        accuracyDisplay.textContent =
            100;

        wordsDisplay.textContent =
            0;

        charactersDisplay.textContent =
            "0 characters";

        result.style.display =
            "none";

        displayText();

        input.focus();

    }
);


/* Load saved best WPM */

const savedBestWPM =
    Number(
        localStorage.getItem(
            "bestWPM"
        )
    ) || 0;

bestWpmDisplay.textContent =
    savedBestWPM;


/* Change application theme */

themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );

        const darkMode =
            document.body.classList.contains(
                "dark"
            );

        if (darkMode) {

            themeToggle.textContent =
                "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeToggle.textContent =
                "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );
        }

        checkTyping();
    }
);


/* Load saved theme */

const savedTheme =
    localStorage.getItem(
        "theme"
    );

if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    themeToggle.textContent =
        "☀️";

} else {

    themeToggle.textContent =
        "🌙";
}


/* Initialize application */

displayText();

updateTimer();