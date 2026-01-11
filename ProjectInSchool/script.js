// Array to store all tasks
let tasks = [];

// Used to track editing mode
let editIndex = null;

// Load tasks when the page loads
window.onload = loadTasks;

/*
    Save a task (add or edit)
*/
function saveTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const type = document.getElementById("type").value;
    const deadline = document.getElementById("deadline").value;

    if (!title || !deadline) {
        alert("Please enter a title and deadline.");
        return;
    }

    const task = { title, description, type, deadline };

    if (editIndex !== null) {
        tasks[editIndex] = task;
        editIndex = null;
    } else {
        tasks.push(task);
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    clearForm();
    displayTasks();
}

/*
    Load tasks from localStorage
*/
function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    displayTasks();
}

/*
    Display tasks sorted by deadline
*/
function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        const now = new Date();
        const deadlineDate = new Date(task.deadline);

        if (deadlineDate < now) {
            taskDiv.classList.add("overdue");
        } else if (deadlineDate - now <= 24 * 60 * 60 * 1000) {
            taskDiv.classList.add("due-soon");
        }

        taskDiv.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <small>
                Type: ${task.type}<br>
                Deadline: ${deadlineDate.toLocaleString()}
            </small><br><br>
            <button onclick="editTask(${index})">Edit</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;

        taskList.appendChild(taskDiv);
    });
}

/*
    Edit a task
*/
function editTask(index) {
    const task = tasks[index];

    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("type").value = task.type;
    document.getElementById("deadline").value = task.deadline;

    editIndex = index;
}

/*
    Delete a task
*/
function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
    }
}

/*
    Clear input fields
*/
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("type").value = "Assignment";
    document.getElementById("deadline").value = "";
}
