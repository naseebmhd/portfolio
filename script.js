let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  let input = document.getElementById("taskInput");
  if (input.value === "") return;

if (input.value.length < 3) {
  alert("Task must be at least 3 characters");
  return;
}

  tasks.push({ text: input.value, completed: false });
  input.value = "";
  saveTasks();
  displayTasks();
}


function displayTasks(filter = "all") {
  let total = tasks.length;
let completed = tasks.filter(t => t.completed).length;

document.getElementById("taskCounter").innerText =
  `Total: ${total} | Completed: ${completed}`;
  let list = document.getElementById("taskList");
  
  list.innerHTML = "";

if (tasks.length === 0) {
  list.innerHTML = "<p>No tasks yet 🚀</p>";
  return;
}

  tasks.forEach((task, index) => {
    if (
      (filter === "completed" && !task.completed) ||
      (filter === "pending" && task.completed)
    ) return;

    let li = document.createElement("li");

    li.innerHTML = `
      <span onclick="toggleTask(${index})" class="${task.completed ? 'completed' : ''}">
        ${task.text}
      </span>
      <button onclick="deleteTask(${index})">X</button>
    `;

    list.appendChild(li);
  });
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  displayTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  displayTasks();
}

function filterTasks(type) {
  displayTasks(type);
}

// Load tasks on start
displayTasks();

document.getElementById("taskInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});