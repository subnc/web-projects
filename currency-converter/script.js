const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

const fromSymbol = document.getElementById("fromSymbol");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const themeBtn = document.getElementById("themeBtn");

const result = document.getElementById("result");
const rateText = document.getElementById("rateText");
const updatedText = document.getElementById("updatedText");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const quickButtons = document.querySelectorAll(".quick-btn");
const toast = document.getElementById("toast");

let toastTimer;

const currencySymbols = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
    CNY: "¥",
    SGD: "S$",
    AED: "د.إ",
    SAR: "﷼",
    NZD: "NZ$",
    ZAR: "R"
};

// Format currency amount
function formatCurrency(amount, currency) {
    const symbol = currencySymbols[currency] || currency;

    return `${symbol}${Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Format exchange rate
function formatRate(rate) {
    return Number(rate).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    });
}

// Show notification
function showToast(message, type = "success") {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Update amount symbol
function updateFromSymbol() {
    const currency = fromCurrency.value;
    fromSymbol.textContent = currencySymbols[currency] || currency;
}

// Convert currency using the exchange-rate API
async function convertCurrency() {
    const amount = Number(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (!Number.isFinite(amount) || amount <= 0) {
        showToast("Please enter a valid amount.", "error");
        amountInput.focus();
        return;
    }

    updateFromSymbol();

    if (from === to) {
        result.textContent = formatCurrency(amount, to);
        rateText.textContent = `1 ${from} = 1 ${to}`;
        updatedText.textContent = "Same currency selected";

        saveConversion(
            amount,
            from,
            to,
            amount,
            1,
            ""
        );

        showToast("Conversion completed.");
        return;
    }

    convertBtn.disabled = true;
    convertBtn.textContent = "Converting...";

    try {
        const response = await fetch(
            `https://api.frankfurter.dev/v2/rate/${from}/${to}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch exchange rate.");
        }

        const data = await response.json();

        const rate = data.rate;
        const convertedAmount = amount * rate;

        result.textContent = formatCurrency(
            convertedAmount,
            to
        );

        rateText.textContent =
            `1 ${from} = ${formatRate(rate)} ${to}`;

        if (data.date) {
            updatedText.textContent =
                `Rate date: ${data.date}`;
        } else {
            updatedText.textContent =
                "Latest available exchange rate";
        }

        saveConversion(
            amount,
            from,
            to,
            convertedAmount,
            rate,
            data.date || ""
        );

        showToast("Conversion completed.");

    } catch (error) {
        result.textContent = "Conversion failed";

        rateText.textContent =
            "Unable to fetch the exchange rate.";

        updatedText.textContent =
            "Please try again later.";

        showToast(
            "Could not connect to the exchange-rate service.",
            "error"
        );

    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = "Convert";
    }
}

// Swap currencies
function swapCurrencies() {
    const oldFrom = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = oldFrom;

    updateFromSymbol();
    saveSettings();

    if (amountInput.value) {
        convertCurrency();
    }
}

// Save conversion history
function saveConversion(
    amount,
    from,
    to,
    convertedAmount,
    rate,
    date
) {
    const history = JSON.parse(
        localStorage.getItem("currencyHistory") || "[]"
    );

    const conversion = {
        amount,
        from,
        to,
        convertedAmount,
        rate,
        date
    };

    // Replace an existing identical conversion
    const existingIndex = history.findIndex(item =>
        item.amount === amount &&
        item.from === from &&
        item.to === to
    );

    if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
    }

    history.unshift(conversion);

    // Keep only the latest 10 conversions
    if (history.length > 10) {
        history.pop();
    }

    localStorage.setItem(
        "currencyHistory",
        JSON.stringify(history)
    );

    displayHistory();
}

// Display conversion history
function displayHistory() {
    const history = JSON.parse(
        localStorage.getItem("currencyHistory") || "[]"
    );

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                No recent conversions.
            </div>
        `;
        return;
    }

    history.forEach(item => {
        const historyItem = document.createElement("div");

        historyItem.className = "history-item";

        historyItem.innerHTML = `
            <div>
                <div class="history-conversion">
                    ${formatCurrency(item.amount, item.from)}
                    <span>→</span>
                    ${formatCurrency(item.convertedAmount, item.to)}
                </div>

                <div class="history-rate">
                    1 ${item.from} = ${formatRate(item.rate)} ${item.to}
                </div>
            </div>
        `;

        historyItem.addEventListener("click", () => {
            amountInput.value = item.amount;
            fromCurrency.value = item.from;
            toCurrency.value = item.to;

            updateFromSymbol();
            saveSettings();
            convertCurrency();
        });

        historyList.appendChild(historyItem);
    });
}

// Clear conversion history
function clearHistory() {
    const history = JSON.parse(
        localStorage.getItem("currencyHistory") || "[]"
    );

    if (history.length === 0) {
        showToast(
            "There is no history to clear.",
            "error"
        );
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to clear all conversion history?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem("currencyHistory");

    displayHistory();

    showToast("Conversion history cleared.");
}

// Save selected currencies
function saveSettings() {
    const settings = {
        from: fromCurrency.value,
        to: toCurrency.value
    };

    localStorage.setItem(
        "currencySettings",
        JSON.stringify(settings)
    );
}

// Load selected currencies
function loadSettings() {
    const savedSettings = localStorage.getItem(
        "currencySettings"
    );

    if (!savedSettings) {
        updateFromSymbol();
        return;
    }

    try {
        const settings = JSON.parse(savedSettings);

        if (settings.from) {
            fromCurrency.value = settings.from;
        }

        if (settings.to) {
            toCurrency.value = settings.to;
        }

    } catch (error) {
        localStorage.removeItem("currencySettings");
    }

    updateFromSymbol();
}

// Toggle dark/light mode
function toggleTheme() {
    document.body.classList.toggle("light-mode");

    const isLightMode =
        document.body.classList.contains("light-mode");

    themeBtn.textContent = isLightMode ? "☾" : "☀";

    localStorage.setItem(
        "currencyTheme",
        isLightMode ? "light" : "dark"
    );
}

// Load saved theme
function loadTheme() {
    const savedTheme =
        localStorage.getItem("currencyTheme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeBtn.textContent = "☾";
    } else {
        themeBtn.textContent = "☀";
    }
}

// Quick amount buttons
quickButtons.forEach(button => {
    button.addEventListener("click", () => {
        amountInput.value = button.dataset.amount;
        convertCurrency();
    });
});

// Event listeners
convertBtn.addEventListener(
    "click",
    convertCurrency
);

swapBtn.addEventListener(
    "click",
    swapCurrencies
);

clearHistoryBtn.addEventListener(
    "click",
    clearHistory
);

themeBtn.addEventListener(
    "click",
    toggleTheme
);

fromCurrency.addEventListener(
    "change",
    () => {
        updateFromSymbol();
        saveSettings();
    }
);

toCurrency.addEventListener(
    "change",
    () => {
        saveSettings();
    }
);

amountInput.addEventListener(
    "keydown",
    event => {
        if (event.key === "Enter") {
            convertCurrency();
        }
    }
);

// Initialize application
loadTheme();
loadSettings();
displayHistory();