let taskList = document.getElementById("taskList");
let currentFilter = "all";

// Load tasks on page load
window.onload = function () {
  loadTasks();
  checkReminders();
  loadDarkMode();
};

// Save tasks
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  taskList.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task, index) => {

    // Filter Logic
    if (currentFilter === "completed" && !task.completed) return;
    if (currentFilter === "pending" && task.completed) return;

    let li = document.createElement("li");

    let priorityClass = "";
    if (task.priority === "High") priorityClass = "priority-high";
    if (task.priority === "Medium") priorityClass = "priority-medium";
    if (task.priority === "Low") priorityClass = "priority-low";

    li.innerHTML = `
      <div class="task-row">
        <span class="${task.completed ? "completed" : ""}" onclick="completeTask(${index})">
          ${task.text}
        </span>

        <div>
          <button class="edit-btn" onclick="editTask(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        </div>
      </div>

      <div class="reminder-text">
        ${task.reminder ? "⏰ Reminder: " + task.reminder : ""}
      </div>

      <div class="category-text">
        📌 Category: ${task.category}
      </div>

      <div class="${priorityClass}">
        ⭐ Priority: ${task.priority}
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Add Task
function addTask() {
  let taskInput = document.getElementById("taskInput");
  let reminderInput = document.getElementById("reminderTime");
  let categoryInput = document.getElementById("category");
  let priorityInput = document.getElementById("priority");

  let taskText = taskInput.value.trim();
  let reminderTime = reminderInput.value;
  let category = categoryInput.value;
  let priority = priorityInput.value;

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push({
    text: taskText,
    reminder: reminderTime,
    category: category,
    priority: priority,
    completed: false,
    reminded: false
  });

  saveTasks(tasks);
  loadTasks();

  taskInput.value = "";
  reminderInput.value = "";
}

// Complete Task
function completeTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks[index].completed = !tasks[index].completed;

  saveTasks(tasks);
  loadTasks();
}

// Delete Task
function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.splice(index, 1);

  saveTasks(tasks);
  loadTasks();
}

// Edit Task
function editTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  let newTask = prompt("Edit your task:", tasks[index].text);

  if (newTask !== null && newTask.trim() !== "") {
    tasks[index].text = newTask.trim();
    saveTasks(tasks);
    loadTasks();
  }
}

// Search Task
function searchTask() {
  let searchValue = document.getElementById("searchInput").value.toLowerCase();
  let allTasks = document.querySelectorAll("#taskList li");

  allTasks.forEach(task => {
    let taskText = task.querySelector("span").innerText.toLowerCase();

    if (taskText.includes(searchValue)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}

// Filter Tasks
function filterTasks(filterType) {
  currentFilter = filterType;
  loadTasks();
  searchTask();
}

// Clear All Tasks
function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    localStorage.removeItem("tasks");
    loadTasks();
  }
}

// Reminder Checker
function checkReminders() {
  setInterval(() => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let now = new Date();

    tasks.forEach((task, index) => {
      if (task.reminder && !task.reminded) {
        let reminderDate = new Date(task.reminder);

        if (now >= reminderDate) {
          alert("⏰ Reminder: " + task.text);

          tasks[index].reminded = true;
          saveTasks(tasks);
          loadTasks();
        }
      }
    });
  }, 1000);
}

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
}

// Load Dark Mode Setting
function loadDarkMode() {
  let darkMode = localStorage.getItem("darkMode");

  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
  }
}