const pollForm = document.getElementById("pollForm");
const pollQuestion = document.getElementById("pollQuestion");
const optionsContainer = document.getElementById("optionsContainer");
const addOptionBtn = document.getElementById("addOptionBtn");
const pollContent = document.getElementById("pollContent");
const resultsContent = document.getElementById("resultsContent");
const themeBtn = document.getElementById("themeBtn");

const pollIdBadge = document.getElementById("pollIdBadge");
const statsSection = document.getElementById("statsSection");
const totalVotesStat = document.getElementById("totalVotesStat");
const optionCountStat = document.getElementById("optionCountStat");
const leadingOptionStat = document.getElementById("leadingOptionStat");
const highestVotesStat = document.getElementById("highestVotesStat");

const POLL_KEY = "pollAppData";
const THEME_KEY = "pollAppTheme";
const VOTED_KEY = "pollAppVoted";

let poll = JSON.parse(localStorage.getItem(POLL_KEY)) || null;
let hasVoted = false;

if (poll) {
    hasVoted =
        localStorage.getItem(VOTED_KEY) === poll.id;
}

function savePoll() {
    localStorage.setItem(POLL_KEY, JSON.stringify(poll));
}

function generatePollId() {
    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let id = "";

    for (let i = 0; i < 6; i++) {
        id += characters[
            Math.floor(Math.random() * characters.length)
        ];
    }

    return id;
}

function loadTheme() {
    const theme = localStorage.getItem(THEME_KEY);

    if (theme === "light") {
        document.body.classList.add("light");
        themeBtn.textContent = "☀";
    } else {
        themeBtn.textContent = "☾";
    }
}

function addOption() {
    const optionCount =
        optionsContainer.querySelectorAll(".option-row").length;

    if (optionCount >= 6) {
        showToast("You can add a maximum of 6 options.");
        return;
    }

    const row = document.createElement("div");

    row.className = "option-row";

    row.innerHTML = `
        <input
            type="text"
            class="poll-option"
            placeholder="Option ${optionCount + 1}"
            maxlength="80"
            autocomplete="off"
            required
        >

        <button
            type="button"
            class="remove-option"
            aria-label="Remove option"
            title="Remove option"
        >
            ×
        </button>
    `;

    optionsContainer.appendChild(row);
}

function removeOption(button) {
    const rows =
        optionsContainer.querySelectorAll(".option-row");

    if (rows.length <= 2) {
        showToast("A poll needs at least 2 options.");
        return;
    }

    button.closest(".option-row").remove();

    updateOptionPlaceholders();
}

function updateOptionPlaceholders() {
    const inputs =
        optionsContainer.querySelectorAll(".poll-option");

    inputs.forEach((input, index) => {
        input.placeholder = `Option ${index + 1}`;
    });
}

function createPoll(event) {
    event.preventDefault();

    const question = pollQuestion.value.trim();

    const optionInputs =
        optionsContainer.querySelectorAll(".poll-option");

    const options = [];

    optionInputs.forEach(input => {
        const value = input.value.trim();

        if (value) {
            options.push({
                text: value,
                votes: 0
            });
        }
    });

    if (!question) {
        showToast("Please enter a poll question.");
        pollQuestion.focus();
        return;
    }

    if (options.length < 2) {
        showToast("Please add at least 2 options.");
        return;
    }

    if (options.length > 6) {
        showToast("You can use a maximum of 6 options.");
        return;
    }

    const optionNames =
        options.map(option =>
            option.text.toLowerCase()
        );

    if (
        new Set(optionNames).size !== optionNames.length
    ) {
        showToast("Poll options must be different.");
        return;
    }

    poll = {
        id: generatePollId(),
        question,
        options,
        totalVotes: 0,
        createdAt: Date.now()
    };

    hasVoted = false;

    localStorage.removeItem(VOTED_KEY);

    savePoll();

    renderPoll();
    renderResults();
    renderStats();

    pollForm.reset();
    resetOptions();

    showToast("Poll created successfully.");
}

function resetOptions() {
    optionsContainer.innerHTML = `
        <div class="option-row">

            <input
                type="text"
                class="poll-option"
                placeholder="Option 1"
                maxlength="80"
                autocomplete="off"
                required
            >

            <button
                type="button"
                class="remove-option"
                aria-label="Remove option"
                title="Remove option"
            >
                ×
            </button>

        </div>

        <div class="option-row">

            <input
                type="text"
                class="poll-option"
                placeholder="Option 2"
                maxlength="80"
                autocomplete="off"
                required
            >

            <button
                type="button"
                class="remove-option"
                aria-label="Remove option"
                title="Remove option"
            >
                ×
            </button>

        </div>
    `;
}

function renderPoll() {
    if (!poll) {
        pollIdBadge.hidden = true;

        pollContent.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">?</div>

                <h3>No Poll Available</h3>

                <p>
                    Create a poll to start collecting votes.
                </p>

            </div>
        `;

        return;
    }

    pollIdBadge.hidden = false;
    pollIdBadge.textContent = `Poll ID: ${poll.id}`;

    let optionsHTML = "";

    poll.options.forEach((option, index) => {
        optionsHTML += `
            <label class="vote-option">

                <input
                    type="radio"
                    name="pollVote"
                    value="${index}"
                >

                <span>
                    ${escapeHTML(option.text)}
                </span>

            </label>
        `;
    });

    pollContent.innerHTML = `
        <div class="active-poll">

            <div class="poll-meta">
                <span>
                    Poll #${poll.id}
                </span>

                <span>
                    ${poll.totalVotes}
                    vote${poll.totalVotes === 1 ? "" : "s"}
                </span>
            </div>

            <h3 class="poll-question">
                ${escapeHTML(poll.question)}
            </h3>

            <div class="vote-options">
                ${optionsHTML}
            </div>

            <button
                type="button"
                id="voteBtn"
                class="primary-btn vote-btn"
                ${hasVoted ? "disabled" : ""}
            >
                ${hasVoted ? "Vote Submitted" : "Vote"}
            </button>

            <div class="poll-actions">

                <button
                    type="button"
                    id="sharePollBtn"
                    class="secondary-btn"
                >
                    Share Poll
                </button>

                <button
                    type="button"
                    id="copyLinkBtn"
                    class="secondary-btn"
                >
                    Copy Link
                </button>

            </div>

            <button
                type="button"
                id="resetPollBtn"
                class="secondary-btn reset-btn"
            >
                Reset Votes
            </button>

            <button
                type="button"
                id="deletePollBtn"
                class="danger-btn"
            >
                Delete Poll
            </button>

            <p class="vote-note">
                ${
                    hasVoted
                        ? "You have already voted in this poll."
                        : "Select one option and submit your vote."
                }
            </p>

        </div>
    `;
}

function vote() {
    if (!poll) {
        return;
    }

    if (hasVoted) {
        showToast("You have already voted.");
        return;
    }

    const selected =
        document.querySelector(
            'input[name="pollVote"]:checked'
        );

    if (!selected) {
        showToast("Please select an option.");
        return;
    }

    const optionIndex = Number(selected.value);

    poll.options[optionIndex].votes++;
    poll.totalVotes++;

    hasVoted = true;

    localStorage.setItem(VOTED_KEY, poll.id);

    savePoll();

    renderPoll();
    renderResults();
    renderStats();

    showToast("Your vote has been recorded.");
}

function renderResults() {
    if (!poll) {
        resultsContent.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">0</div>

                <h3>No Results Yet</h3>

                <p>
                    Voting results will appear here.
                </p>

            </div>
        `;

        return;
    }

    const sortedOptions = [...poll.options].sort(
        (a, b) => b.votes - a.votes
    );

    let resultsHTML = "";

    sortedOptions.forEach(option => {
        const percentage =
            poll.totalVotes === 0
                ? 0
                : Math.round(
                    (option.votes / poll.totalVotes) * 100
                );

        resultsHTML += `
            <div class="result-item">

                <div class="result-header">

                    <span>
                        ${escapeHTML(option.text)}
                    </span>

                    <strong>
                        ${percentage}%
                    </strong>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width: ${percentage}%"
                    ></div>

                </div>

                <p class="result-votes">
                    ${option.votes}
                    vote${option.votes === 1 ? "" : "s"}
                </p>

            </div>
        `;
    });

    resultsContent.innerHTML = `
        <div class="results">

            <div class="results-summary">

                <span>Total Votes</span>

                <strong>
                    ${poll.totalVotes}
                </strong>

            </div>

            <div class="result-list">
                ${resultsHTML}
            </div>

        </div>
    `;
}

function renderStats() {
    if (!poll) {
        statsSection.hidden = true;
        return;
    }

    statsSection.hidden = false;

    totalVotesStat.textContent =
        poll.totalVotes;

    optionCountStat.textContent =
        poll.options.length;

    const highestVotes = Math.max(
        ...poll.options.map(option => option.votes)
    );

    highestVotesStat.textContent =
        highestVotes;

    if (poll.totalVotes === 0) {
        leadingOptionStat.textContent = "No votes";
        return;
    }

    const leaders = poll.options.filter(
        option => option.votes === highestVotes
    );

    if (leaders.length > 1) {
        leadingOptionStat.textContent = "Tie";
    } else {
        leadingOptionStat.textContent =
            leaders[0].text;
    }
}

function copyPollLink() {
    if (!poll) {
        return;
    }

    const url = window.location.href.split("?")[0]
        + `?poll=${poll.id}`;

    navigator.clipboard.writeText(url)
        .then(() => {
            showToast("Poll link copied.");
        })
        .catch(() => {
            showToast("Unable to copy the link.");
        });
}

function sharePoll() {
    if (!poll) {
        return;
    }

    const url = window.location.href.split("?")[0]
        + `?poll=${poll.id}`;

    const shareData = {
        title: "Poll App",
        text: poll.question,
        url
    };

    if (navigator.share) {
        navigator.share(shareData)
            .catch(() => {});
    } else {
        copyPollLink();
    }
}

function resetPoll() {
    if (!poll) {
        return;
    }

    showConfirm(
        "Reset Poll",
        "Are you sure you want to reset all votes?",
        () => {
            poll.options.forEach(option => {
                option.votes = 0;
            });

            poll.totalVotes = 0;
            hasVoted = false;

            localStorage.removeItem(VOTED_KEY);

            savePoll();

            renderPoll();
            renderResults();
            renderStats();

            showToast("All votes have been reset.");
        }
    );
}

function deletePoll() {
    if (!poll) {
        return;
    }

    showConfirm(
        "Delete Poll",
        "Are you sure you want to delete the current poll?",
        () => {
            poll = null;
            hasVoted = false;

            localStorage.removeItem(POLL_KEY);
            localStorage.removeItem(VOTED_KEY);

            renderPoll();
            renderResults();
            renderStats();

            showToast("Poll deleted.");
        }
    );
}

function toggleTheme() {
    const isLight =
        document.body.classList.toggle("light");

    localStorage.setItem(
        THEME_KEY,
        isLight ? "light" : "dark"
    );

    themeBtn.textContent =
        isLight ? "☀" : "☾";
}

function escapeHTML(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showToast(message) {
    let toast =
        document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");

        toast.id = "toast";
        toast.className = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function showConfirm(title, message, action) {
    let modal =
        document.getElementById("confirmModal");

    if (!modal) {
        modal = document.createElement("div");

        modal.id = "confirmModal";
        modal.className = "modal";

        modal.innerHTML = `
            <div class="confirm-content">

                <div class="confirm-icon">
                    !
                </div>

                <h3 id="confirmTitle"></h3>

                <p id="confirmText"></p>

                <div class="confirm-actions">

                    <button
                        type="button"
                        id="cancelConfirmBtn"
                        class="secondary-btn"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="confirmActionBtn"
                        class="primary-btn"
                    >
                        Confirm
                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(modal);

        document
            .getElementById("cancelConfirmBtn")
            .addEventListener(
                "click",
                closeConfirm
            );

        modal.addEventListener(
            "click",
            event => {
                if (event.target === modal) {
                    closeConfirm();
                }
            }
        );
    }

    document.getElementById(
        "confirmTitle"
    ).textContent = title;

    document.getElementById(
        "confirmText"
    ).textContent = message;

    const confirmButton =
        document.getElementById(
            "confirmActionBtn"
        );

    confirmButton.onclick = () => {
        closeConfirm();
        action();
    };

    modal.classList.add("show");
}

function closeConfirm() {
    const modal =
        document.getElementById("confirmModal");

    if (modal) {
        modal.classList.remove("show");
    }
}

addOptionBtn.addEventListener(
    "click",
    addOption
);

optionsContainer.addEventListener(
    "click",
    event => {
        if (
            event.target.classList.contains(
                "remove-option"
            )
        ) {
            removeOption(event.target);
        }
    }
);

pollForm.addEventListener(
    "submit",
    createPoll
);

themeBtn.addEventListener(
    "click",
    toggleTheme
);

document.addEventListener(
    "click",
    event => {

        if (event.target.id === "voteBtn") {
            vote();
        }

        if (
            event.target.id === "resetPollBtn"
        ) {
            resetPoll();
        }

        if (
            event.target.id === "deletePollBtn"
        ) {
            deletePoll();
        }

        if (
            event.target.id === "copyLinkBtn"
        ) {
            copyPollLink();
        }

        if (
            event.target.id === "sharePollBtn"
        ) {
            sharePoll();
        }
    }
);

document.addEventListener(
    "keydown",
    event => {
        if (event.key === "Escape") {
            closeConfirm();
        }
    }
);

loadTheme();
renderPoll();
renderResults();
renderStats();