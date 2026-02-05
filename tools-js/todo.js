const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".todo-filters button");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
let currentFilter = "all";

renderTasks();

/* Add Task */
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  taskInput.value = "";
  saveAndRender();
}

/* Render */
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <label>
        <input type="checkbox" ${task.completed ? "checked" : ""} />
        <span>${task.text}</span>
      </label>
      <div class="task-actions">
        <button class="edit">✏️</button>
        <button class="delete">🗑️</button>
      </div>
    `;

    li.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;
      saveAndRender();
    });

    li.querySelector(".delete").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveAndRender();
    });

    li.querySelector(".edit").addEventListener("click", () => {
      const newText = prompt("Edit task:", task.text);
      if (newText) {
        task.text = newText.trim();
        saveAndRender();
      }
    });

    taskList.appendChild(li);
  });

  updateCount();
}

/* Filters */
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

/* Clear Completed */
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveAndRender();
});

/* Helpers */
function saveAndRender() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
  renderTasks();
}

function updateCount() {
  const active = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${active} active task${active !== 1 ? "s" : ""}`;
}
