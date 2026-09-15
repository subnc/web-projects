const applicationsKey = "placementApplications";
const themeKey = "placementTrackerTheme";

let applications = JSON.parse(localStorage.getItem(applicationsKey)) || [];
let editingId = null;
let deletingId = null;

const applicationsContainer = document.getElementById("applicationsContainer");
const emptyState = document.getElementById("emptyState");
const applicationCount = document.getElementById("applicationCount");

const totalApplications = document.getElementById("totalApplications");
const appliedApplications = document.getElementById("appliedApplications");
const interviewApplications = document.getElementById("interviewApplications");
const selectionRate = document.getElementById("selectionRate");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortSelect = document.getElementById("sortSelect");

const applicationModal = document.getElementById("applicationModal");
const viewModal = document.getElementById("viewModal");
const deleteModal = document.getElementById("deleteModal");

const applicationForm = document.getElementById("applicationForm");
const modalTitle = document.getElementById("modalTitle");

const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const locationInput = document.getElementById("location");
const packageInput = document.getElementById("package");
const statusInput = document.getElementById("status");
const applicationDateInput = document.getElementById("applicationDate");
const deadlineInput = document.getElementById("deadline");
const applicationNotes = document.getElementById("applicationNotes");

const viewContent = document.getElementById("viewContent");
const toast = document.getElementById("toast");

const progressStatuses = [
    "Wishlist",
    "Applied",
    "Online Test",
    "Interview",
    "Selected"
];

function saveApplications() {
    localStorage.setItem(
        applicationsKey,
        JSON.stringify(applications)
    );
}

function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
    if (!dateString) {
        return "Not specified";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getStatusClass(status) {
    const classes = {
        "Wishlist": "status-wishlist",
        "Applied": "status-applied",
        "Online Test": "status-test",
        "Interview": "status-interview",
        "Selected": "status-selected",
        "Rejected": "status-rejected"
    };

    return classes[status] || "status-wishlist";
}

function getDaysRemaining(deadline) {
    if (!deadline) {
        return null;
    }

    const today = new Date(getToday() + "T00:00:00");
    const target = new Date(deadline + "T00:00:00");

    return Math.ceil(
        (target - today) / 86400000
    );
}

function getDeadlineText(deadline) {
    if (!deadline) {
        return "No deadline";
    }

    const days = getDaysRemaining(deadline);

    if (days < 0) {
        return "Deadline expired";
    }

    if (days === 0) {
        return "Deadline is today";
    }

    if (days === 1) {
        return "Deadline is tomorrow";
    }

    return `Deadline is in ${days} days`;
}

function getDeadlineClass(deadline) {
    if (!deadline) {
        return "";
    }

    const days = getDaysRemaining(deadline);

    if (days < 0) {
        return "deadline-danger";
    }

    if (days <= 2) {
        return "deadline-warning";
    }

    return "deadline-success";
}

function getProgressHTML(status) {
    const currentIndex = progressStatuses.indexOf(status);

    if (status === "Rejected") {
        return `
            <div class="progress">
                ${progressStatuses.map((item, index) => `
                    <div class="progress-step ${index < 0 ? "completed" : ""}">
                        <div class="progress-dot"></div>
                        <span>
                            ${item === "Online Test" ? "Test" : item}
                        </span>
                    </div>
                `).join("")}
            </div>

            <div class="rejected-label">
                Application marked as Rejected
            </div>
        `;
    }

    return `
        <div class="progress">
            ${progressStatuses.map((item, index) => {

                let className = "";

                if (index < currentIndex) {
                    className = "completed";
                }

                if (index === currentIndex) {
                    className = "active";
                }

                return `
                    <div class="progress-step ${className}">
                        <div class="progress-dot"></div>

                        <span>
                            ${item === "Online Test" ? "Test" : item}
                        </span>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function updateStatistics() {
    const total = applications.length;

    const applied = applications.filter(
        application => application.status === "Applied"
    ).length;

    const interviews = applications.filter(
        application => application.status === "Interview"
    ).length;

    const selected = applications.filter(
        application => application.status === "Selected"
    ).length;

    const rate = total === 0
        ? 0
        : Math.round((selected / total) * 100);

    totalApplications.textContent = total;
    appliedApplications.textContent = applied;
    interviewApplications.textContent = interviews;
    selectionRate.textContent = `${rate}%`;

    applicationCount.textContent =
        `${total} ${total === 1 ? "application" : "applications"}`;
}

function filterApplications() {
    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const selectedStatus = statusFilter.value;
    const sortValue = sortSelect.value;

    let filtered = applications.filter(application => {

        const company =
            String(application.company || "").toLowerCase();

        const role =
            String(application.role || "").toLowerCase();

        const location =
            String(application.location || "").toLowerCase();

        const matchesSearch =
            company.includes(searchTerm) ||
            role.includes(searchTerm) ||
            location.includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            application.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {

        switch (sortValue) {

            case "oldest":
                return new Date(a.applicationDate) -
                    new Date(b.applicationDate);

            case "deadline":

                if (!a.deadline) {
                    return 1;
                }

                if (!b.deadline) {
                    return -1;
                }

                return new Date(a.deadline) -
                    new Date(b.deadline);

            case "az":
                return a.company.localeCompare(b.company);

            case "za":
                return b.company.localeCompare(a.company);

            case "status":
                return a.status.localeCompare(b.status);

            case "latest":
            default:
                return new Date(b.applicationDate) -
                    new Date(a.applicationDate);
        }
    });

    return filtered;
}

function displayApplications() {
    const filtered = filterApplications();

    applicationsContainer.innerHTML = "";

    if (filtered.length === 0) {

        emptyState.style.display = "block";

        updateStatistics();

        return;
    }

    emptyState.style.display = "none";

    filtered.forEach(application => {

        const deadlineClass =
            getDeadlineClass(application.deadline);

        const card =
            document.createElement("article");

        card.className = "application-card";

        card.innerHTML = `

            <div class="application-top">

                <div class="company-info">

                    <h2>
                        ${escapeHTML(application.company)}
                    </h2>

                    <p>
                        ${escapeHTML(application.role)}
                    </p>

                </div>

                <span
                    class="status-badge ${getStatusClass(application.status)}"
                >
                    ${escapeHTML(application.status)}
                </span>

            </div>

            ${getProgressHTML(application.status)}

            <div class="application-details">

                <div class="detail-box">

                    <span>Location</span>

                    <strong>
                        ${escapeHTML(application.location)}
                    </strong>

                </div>

                <div class="detail-box">

                    <span>Package</span>

                    <strong>
                        ${escapeHTML(
                            application.package || "Not specified"
                        )}
                    </strong>

                </div>

                <div class="detail-box">

                    <span>Applied</span>

                    <strong>
                        ${formatDate(application.applicationDate)}
                    </strong>

                </div>

                <div class="detail-box">

                    <span>Deadline</span>

                    <strong class="${deadlineClass}">
                        ${escapeHTML(
                            getDeadlineText(application.deadline)
                        )}
                    </strong>

                </div>

            </div>

            ${application.notes ? `

                <div class="notes-preview">

                    <span>Notes / Remarks</span>

                    <p>
                        ${escapeHTML(application.notes)}
                    </p>

                </div>

            ` : ""}

            <div class="card-actions">

                <button
                    class="action-button"
                    data-action="view"
                    data-id="${application.id}"
                    type="button"
                >
                    View
                </button>

                <button
                    class="action-button"
                    data-action="edit"
                    data-id="${application.id}"
                    type="button"
                >
                    Edit
                </button>

                <button
                    class="action-button delete"
                    data-action="delete"
                    data-id="${application.id}"
                    type="button"
                >
                    Delete
                </button>

            </div>
        `;

        applicationsContainer.appendChild(card);
    });

    updateStatistics();
}

function openAddModal() {

    editingId = null;

    modalTitle.textContent = "Add Application";

    applicationForm.reset();

    applicationDateInput.value = getToday();

    deadlineInput.min =
        applicationDateInput.value;

    applicationModal.classList.remove("hidden");

    companyInput.focus();
}

function openEditModal(application) {

    editingId = application.id;

    modalTitle.textContent = "Edit Application";

    companyInput.value =
        application.company || "";

    roleInput.value =
        application.role || "";

    locationInput.value =
        application.location || "";

    packageInput.value =
        application.package || "";

    statusInput.value =
        application.status || "Wishlist";

    applicationDateInput.value =
        application.applicationDate || getToday();

    deadlineInput.value =
        application.deadline || "";

    applicationNotes.value =
        application.notes || "";

    deadlineInput.min =
        applicationDateInput.value;

    applicationModal.classList.remove("hidden");

    companyInput.focus();
}

function editApplication(id) {

    const application =
        applications.find(item => item.id === id);

    if (!application) {
        return;
    }

    openEditModal(application);
}

function viewApplication(id) {

    const application =
        applications.find(item => item.id === id);

    if (!application) {
        return;
    }

    viewContent.innerHTML = `

        <div class="view-grid">

            <div class="view-item">

                <span class="view-label">
                    Company
                </span>

                <span class="view-value">
                    ${escapeHTML(application.company)}
                </span>

            </div>

            <div class="view-item">

                <span class="view-label">
                    Job Role
                </span>

                <span class="view-value">
                    ${escapeHTML(application.role)}
                </span>

            </div>

            <div class="view-item">

                <span class="view-label">
                    Location
                </span>

                <span class="view-value">
                    ${escapeHTML(application.location)}
                </span>

            </div>

            <div class="view-item">

                <span class="view-label">
                    Package
                </span>

                <span class="view-value">
                    ${escapeHTML(
                        application.package || "Not specified"
                    )}
                </span>

            </div>

            <div class="view-item">

                <span class="view-label">
                    Status
                </span>

                <span class="view-value">
                    ${escapeHTML(application.status)}
                </span>

            </div>

            <div class="view-item">

                <span class="view-label">
                    Application Date
                </span>

                <span class="view-value">
                    ${formatDate(application.applicationDate)}
                </span>

            </div>

            <div class="view-item">

                <span class="view-label">
                    Deadline
                </span>

                <span class="view-value">
                    ${formatDate(application.deadline)}
                </span>

            </div>

            <div class="view-item">

                <span class="view-label">
                    Deadline Status
                </span>

                <span class="view-value">
                    ${escapeHTML(
                        getDeadlineText(application.deadline)
                    )}
                </span>

            </div>

            <div class="view-item full-width">

                <span class="view-label">
                    Notes / Remarks
                </span>

                <span class="view-value">
                    ${escapeHTML(
                        application.notes || "No notes added"
                    )}
                </span>

            </div>

        </div>
    `;

    viewModal.classList.remove("hidden");
}

function deleteApplication(id) {

    const application =
        applications.find(item => item.id === id);

    if (!application) {
        return;
    }

    deletingId = id;

    deleteModal.classList.remove("hidden");
}

function confirmDelete() {

    if (!deletingId) {
        return;
    }

    applications =
        applications.filter(
            application => application.id !== deletingId
        );

    saveApplications();

    displayApplications();

    deletingId = null;

    deleteModal.classList.add("hidden");

    showToast("Application deleted successfully.");
}

function closeApplicationModal() {

    applicationModal.classList.add("hidden");

    editingId = null;
}

function closeViewModal() {

    viewModal.classList.add("hidden");
}

function closeDeleteModal() {

    deleteModal.classList.add("hidden");

    deletingId = null;
}

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer =
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
}

applicationForm.addEventListener("submit", event => {

    event.preventDefault();

    const company =
        companyInput.value.trim();

    const role =
        roleInput.value.trim();

    const location =
        locationInput.value.trim();

    const packageValue =
        packageInput.value.trim();

    const status =
        statusInput.value;

    const applicationDate =
        applicationDateInput.value;

    const deadline =
        deadlineInput.value;

    const notes =
        applicationNotes.value.trim();

    if (
        !company ||
        !role ||
        !location ||
        !applicationDate
    ) {

        showToast(
            "Please fill in all required fields."
        );

        return;
    }

    if (
        deadline &&
        deadline < applicationDate
    ) {

        showToast(
            "Deadline cannot be before the application date."
        );

        return;
    }

    if (editingId) {

        const index =
            applications.findIndex(
                application =>
                    application.id === editingId
            );

        if (index !== -1) {

            applications[index] = {
                ...applications[index],
                company,
                role,
                location,
                package: packageValue,
                status,
                applicationDate,
                deadline,
                notes
            };
        }

        showToast(
            "Application updated successfully."
        );

    } else {

        const newApplication = {

            id: Date.now().toString(),

            company,
            role,
            location,

            package: packageValue,

            status,

            applicationDate,

            deadline,

            notes
        };

        applications.push(newApplication);

        showToast(
            "Application added successfully."
        );
    }

    saveApplications();

    displayApplications();

    closeApplicationModal();
});

applicationDateInput.addEventListener(
    "change",
    () => {

        deadlineInput.min =
            applicationDateInput.value;

        if (
            deadlineInput.value &&
            deadlineInput.value <
            applicationDateInput.value
        ) {

            deadlineInput.value = "";
        }
    }
);

applicationsContainer.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("[data-action]");

        if (!button) {
            return;
        }

        const id =
            button.dataset.id;

        const action =
            button.dataset.action;

        if (action === "view") {
            viewApplication(id);
        }

        if (action === "edit") {
            editApplication(id);
        }

        if (action === "delete") {
            deleteApplication(id);
        }
    }
);

document
    .getElementById("addApplicationBtn")
    .addEventListener(
        "click",
        openAddModal
    );

document
    .getElementById("emptyAddBtn")
    .addEventListener(
        "click",
        openAddModal
    );

document
    .getElementById("cancelApplicationBtn")
    .addEventListener(
        "click",
        closeApplicationModal
    );

document
    .getElementById("closeApplicationModal")
    .addEventListener(
        "click",
        closeApplicationModal
    );

document
    .getElementById("closeViewModal")
    .addEventListener(
        "click",
        closeViewModal
    );

document
    .getElementById("closeDeleteModal")
    .addEventListener(
        "click",
        closeDeleteModal
    );

document
    .getElementById("cancelDeleteBtn")
    .addEventListener(
        "click",
        closeDeleteModal
    );

document
    .getElementById("confirmDeleteBtn")
    .addEventListener(
        "click",
        confirmDelete
    );

searchInput.addEventListener(
    "input",
    displayApplications
);

statusFilter.addEventListener(
    "change",
    displayApplications
);

sortSelect.addEventListener(
    "change",
    displayApplications
);

applicationModal.addEventListener(
    "click",
    event => {

        if (event.target === applicationModal) {
            closeApplicationModal();
        }
    }
);

viewModal.addEventListener(
    "click",
    event => {

        if (event.target === viewModal) {
            closeViewModal();
        }
    }
);

deleteModal.addEventListener(
    "click",
    event => {

        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    }
);

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        closeApplicationModal();
        closeViewModal();
        closeDeleteModal();
    }
);

function loadTheme() {

    const savedTheme =
        localStorage.getItem(themeKey);

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }

    updateThemeButton();
}

function updateThemeButton() {

    const button =
        document.getElementById("themeToggle");

    if (
        document.body.classList.contains(
            "light-mode"
        )
    ) {

        button.textContent = "☀";

        button.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    } else {

        button.textContent = "☾";

        button.setAttribute(
            "aria-label",
            "Switch to light mode"
        );
    }
}

document
    .getElementById("themeToggle")
    .addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-mode"
            );

            const theme =
                document.body.classList.contains(
                    "light-mode"
                )
                    ? "light"
                    : "dark";

            localStorage.setItem(
                themeKey,
                theme
            );

            updateThemeButton();
        }
    );

loadTheme();
displayApplications();