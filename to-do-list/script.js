// DOM elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const sortTasks = document.getElementById("sortTasks");

const taskList = document.getElementById("taskList");
const taskSummary = document.getElementById("taskSummary");

const allCount = document.getElementById("allCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");
const progressPercent = document.getElementById("progressPercent");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const themeBtn = document.getElementById("themeBtn");

const editModal = document.getElementById("editModal");
const editTaskForm = document.getElementById("editTaskForm");
const editTaskInput = document.getElementById("editTaskInput");
const editPriority = document.getElementById("editPriority");
const editDueDate = document.getElementById("editDueDate");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const confirmModal = document.getElementById("confirmModal");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const confirmModalMessage = document.getElementById("confirmModalMessage");
const confirmActionBtn = document.getElementById("confirmActionBtn");
const cancelConfirmBtn = document.getElementById("cancelConfirmBtn");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


// Application state
let tasks = [];
let currentFilter = "all";
let searchText = "";
let editingTaskId = null;
let confirmAction = null;

const TASK_STORAGE_KEY = "todoTasks";
const THEME_STORAGE_KEY = "todoTheme";


// Load tasks from Local Storage
function loadTasks() {
    const savedTasks = localStorage.getItem(TASK_STORAGE_KEY);

    if (savedTasks) {
        try {
            const parsedTasks = JSON.parse(savedTasks);

            if (Array.isArray(parsedTasks)) {
                tasks = parsedTasks;
            }
        } catch (error) {
            tasks = [];
        }
    }
}


// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}


// Show toast message
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// Generate task ID
function generateTaskId() {
    return Date.now().toString() + Math.random().toString(36).slice(2, 7);
}


// Get today's date
function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Format date
function formatDate(dateString) {
    if (!dateString) {
        return "";
    }

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// Get due date status
function getDueDateStatus(dateString, completed) {
    if (!dateString) {
        return "";
    }

    if (completed) {
        return "due-date";
    }

    const today = getToday();

    if (dateString < today) {
        return "due-date overdue";
    }

    if (dateString === today) {
        return "due-date today";
    }

    return "due-date";
}


// Escape HTML
function escapeHTML(text) {
    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Get filtered tasks
function getFilteredTasks() {
    let filteredTasks = [...tasks];

    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    if (searchText) {
        const query = searchText.toLowerCase();

        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(query)
        );
    }

    return filteredTasks;
}


// Sort tasks
function sortTaskList(taskArray) {
    const sortedTasks = [...taskArray];

    if (sortTasks.value === "newest") {
        sortedTasks.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (sortTasks.value === "oldest") {
        sortedTasks.sort((a, b) => a.createdAt - b.createdAt);
    }

    if (sortTasks.value === "due-date") {
        sortedTasks.sort((a, b) => {

            if (!a.dueDate && !b.dueDate) {
                return b.createdAt - a.createdAt;
            }

            if (!a.dueDate) {
                return 1;
            }

            if (!b.dueDate) {
                return -1;
            }

            return a.dueDate.localeCompare(b.dueDate);
        });
    }

    if (sortTasks.value === "priority") {
        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3
        };

        sortedTasks.sort((a, b) => {
            return (
                priorityOrder[a.priority] -
                priorityOrder[b.priority]
            );
        });
    }

    return sortedTasks;
}


// Get empty state message
function getEmptyState() {
    if (searchText) {
        return {
            icon: "⌕",
            title: "No tasks found",
            message: "Try a different search term."
        };
    }

    if (currentFilter === "active") {
        return {
            icon: "✓",
            title: "All caught up!",
            message: "You have no active tasks."
        };
    }

    if (currentFilter === "completed") {
        return {
            icon: "✓",
            title: "No completed tasks",
            message: "Completed tasks will appear here."
        };
    }

    return {
        icon: "✓",
        title: "No tasks yet",
        message: "Add your first task to get started."
    };
}


// Render tasks
function renderTasks() {
    const filteredTasks = sortTaskList(getFilteredTasks());

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        const empty = getEmptyState();

        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${empty.icon}</div>
                <h3>${empty.title}</h3>
                <p>${empty.message}</p>
            </div>
        `;
    } else {
        filteredTasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });
    }

    updateSummary();
    updateStatistics();
    updateFilterCounts();
}


// Create task element
function createTaskElement(task) {
    const item = document.createElement("div");

    item.className = `task-item ${task.completed ? "completed" : ""}`;

    const dueDateClass = getDueDateStatus(
        task.dueDate,
        task.completed
    );

    let dueDateText = "";

    if (task.dueDate) {

        if (!task.completed && task.dueDate < getToday()) {
            dueDateText =
                `⚠ Overdue · ${formatDate(task.dueDate)}`;
        } else if (
            !task.completed &&
            task.dueDate === getToday()
        ) {
            dueDateText =
                `Due today · ${formatDate(task.dueDate)}`;
        } else {
            dueDateText =
                `Due · ${formatDate(task.dueDate)}`;
        }
    }

    item.innerHTML = `
        <input
            type="checkbox"
            class="task-checkbox"
            ${task.completed ? "checked" : ""}
            aria-label="Complete task"
        >

        <div class="task-content">

            <div class="task-title">
                ${escapeHTML(task.title)}
            </div>

            <div class="task-meta">

                <span class="priority-chip priority-${task.priority}">
                    ${task.priority}
                </span>

                ${
                    dueDateText
                        ? `<span class="${dueDateClass}">
                            ${dueDateText}
                           </span>`
                        : ""
                }

            </div>

        </div>

        <div class="task-buttons">

            <button
                type="button"
                class="task-btn edit-btn"
                title="Edit task"
                aria-label="Edit task"
            >
                ✎
            </button>

            <button
                type="button"
                class="task-btn delete-btn"
                title="Delete task"
                aria-label="Delete task"
            >
                ×
            </button>

        </div>
    `;


    const checkbox = item.querySelector(".task-checkbox");
    const editButton = item.querySelector(".edit-btn");
    const deleteButton = item.querySelector(".delete-btn");

    checkbox.addEventListener("change", () => {
        toggleTask(task.id);
    });

    editButton.addEventListener("click", () => {
        openEditModal(task.id);
    });

    deleteButton.addEventListener("click", () => {
        openConfirmModal(
            "Delete Task",
            "Are you sure you want to delete this task?",
            "Delete",
            () => deleteTask(task.id)
        );
    });

    return item;
}


// Add task
taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title.length < 2) {
        showToast("Task must contain at least 2 characters.");
        taskInput.focus();
        return;
    }

    if (dueDate.value && dueDate.value < getToday()) {
        showToast("Due date cannot be in the past.");
        dueDate.focus();
        return;
    }

    const newTask = {
        id: generateTaskId(),
        title,
        priority: priority.value,
        dueDate: dueDate.value,
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskForm.reset();
    priority.value = "medium";

    showToast("Task added successfully.");

    taskInput.focus();
});


// Toggle task
function toggleTask(taskId) {
    const task = tasks.find(item => item.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();
    renderTasks();

    showToast(
        task.completed
            ? "Task completed."
            : "Task marked as active."
    );
}


// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();
    renderTasks();

    showToast("Task deleted.");
}


// Open edit modal
function openEditModal(taskId) {
    const task = tasks.find(item => item.id === taskId);

    if (!task) {
        return;
    }

    editingTaskId = taskId;

    editTaskInput.value = task.title;
    editPriority.value = task.priority;
    editDueDate.value = task.dueDate || "";

    editModal.classList.add("show");
    editModal.setAttribute("aria-hidden", "false");

    setTimeout(() => {
        editTaskInput.focus();
    }, 100);
}


// Close edit modal
function closeEditModal() {
    editModal.classList.remove("show");
    editModal.setAttribute("aria-hidden", "true");

    editingTaskId = null;
}


// Save edited task
editTaskForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!editingTaskId) {
        return;
    }

    const title = editTaskInput.value.trim();

    if (title.length < 2) {
        showToast("Task must contain at least 2 characters.");
        editTaskInput.focus();
        return;
    }

    const task = tasks.find(item => item.id === editingTaskId);

    if (!task) {
        return;
    }

    task.title = title;
    task.priority = editPriority.value;
    task.dueDate = editDueDate.value;

    saveTasks();
    renderTasks();
    closeEditModal();

    showToast("Task updated successfully.");
});


// Edit modal buttons
closeEditModalBtn.addEventListener(
    "click",
    closeEditModal
);

cancelEditBtn.addEventListener(
    "click",
    closeEditModal
);


// Open confirmation modal
function openConfirmModal(
    title,
    message,
    buttonText,
    action
) {
    confirmModalTitle.textContent = title;
    confirmModalMessage.textContent = message;
    confirmActionBtn.textContent = buttonText;

    confirmAction = action;

    confirmModal.classList.add("show");
    confirmModal.setAttribute("aria-hidden", "false");
}


// Close confirmation modal
function closeConfirmModal() {
    confirmModal.classList.remove("show");
    confirmModal.setAttribute("aria-hidden", "true");

    confirmAction = null;
}


// Confirm action
confirmActionBtn.addEventListener("click", () => {

    if (typeof confirmAction === "function") {
        const action = confirmAction;

        closeConfirmModal();

        action();
    }
});


// Cancel confirmation
cancelConfirmBtn.addEventListener(
    "click",
    closeConfirmModal
);


// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {

    const completed = tasks.filter(
        task => task.completed
    );

    if (completed.length === 0) {
        showToast("There are no completed tasks.");
        return;
    }

    openConfirmModal(
        "Clear Completed",
        `Remove all ${completed.length} completed task${completed.length === 1 ? "" : "s"}?`,
        "Clear",
        () => {

            tasks = tasks.filter(
                task => !task.completed
            );

            saveTasks();
            renderTasks();

            showToast("Completed tasks cleared.");
        }
    );
});


// Filter tasks
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});


// Search tasks
searchInput.addEventListener("input", () => {

    searchText = searchInput.value.trim();

    renderTasks();
});


// Sort tasks
sortTasks.addEventListener(
    "change",
    renderTasks
);


// Update task summary
function updateSummary() {

    const active = tasks.filter(
        task => !task.completed
    ).length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    if (tasks.length === 0) {
        taskSummary.textContent = "0 tasks";
    } else if (active === 0) {
        taskSummary.textContent =
            "All tasks completed";
    } else {
        taskSummary.textContent =
            `${active} active task${active === 1 ? "" : "s"} · ${completed} completed`;
    }
}


// Update statistics
function updateStatistics() {

    const total = tasks.length;

    const active = tasks.filter(
        task => !task.completed
    ).length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const progress =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;
    progressPercent.textContent = `${progress}%`;
}


// Update filter counts
function updateFilterCounts() {

    const total = tasks.length;

    const active = tasks.filter(
        task => !task.completed
    ).length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    allCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}


// Load theme
function loadTheme() {

    const savedTheme =
        localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        themeBtn.textContent = "☾";

    } else {

        themeBtn.textContent = "☀";
    }
}


// Toggle theme
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    const isLight =
        document.body.classList.contains("light-mode");

    localStorage.setItem(
        THEME_STORAGE_KEY,
        isLight ? "light" : "dark"
    );

    themeBtn.textContent =
        isLight ? "☾" : "☀";
});


// Close modals when clicking outside
editModal.addEventListener("click", event => {

    if (event.target === editModal) {
        closeEditModal();
    }
});

confirmModal.addEventListener("click", event => {

    if (event.target === confirmModal) {
        closeConfirmModal();
    }
});


// Close modals with Escape
document.addEventListener("keydown", event => {

    if (event.key !== "Escape") {
        return;
    }

    if (editModal.classList.contains("show")) {
        closeEditModal();
    }

    if (confirmModal.classList.contains("show")) {
        closeConfirmModal();
    }
});


// Initialize application
loadTasks();
loadTheme();
renderTasks();