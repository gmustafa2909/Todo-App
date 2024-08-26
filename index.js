// Selecting elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskCountSpan = document.getElementById('task-count');
const doneCountSpan = document.getElementById('done-count');
const todoContainer = document.querySelector('.container');
const doneContainer = document.querySelector('.doneItem');

let taskCount = 0;
let doneCount = 0;
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let doneTasks = JSON.parse(localStorage.getItem('doneTasks')) || [];

// Function to update task count
function updateTaskCount() {
  taskCountSpan.textContent = taskCount;
}

// Function to update done task count
function updateDoneCount() {
  doneCountSpan.textContent = doneCount;
}

// Function to create a new task element
function createTaskElement(taskText) {
  const taskItemDiv = document.createElement('div');
  taskItemDiv.className = 'taskItem';

  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';
  taskDiv.textContent = taskText;

  const taskBtnDiv = document.createElement('div');
  taskBtnDiv.className = 'taskBtn';

  const completeBtn = document.createElement('button');
  completeBtn.textContent = '✔';

  const editBtn = document.createElement('button');
  editBtn.textContent = '🖍';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';

  taskBtnDiv.append(completeBtn, editBtn, deleteBtn);
  taskItemDiv.append(taskDiv, taskBtnDiv);

  // Event listeners
  completeBtn.addEventListener('click', () => completeTask(taskItemDiv, taskText));
  editBtn.addEventListener('click', () => editTask(taskDiv, taskText));
  deleteBtn.addEventListener('click', () => deleteTask(taskItemDiv, taskText));

  return taskItemDiv;
}

// Function to render tasks from local storage
function renderTasks() {
  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    todoContainer.appendChild(taskElement);
    taskCount++;
  });
  updateTaskCount();

  doneTasks.forEach(task => {
    const doneTaskDiv = document.createElement('div');
    doneTaskDiv.className = 'frame';

    const doneTaskP = document.createElement('p');
    doneTaskP.innerHTML = `<strike>${task}</strike>`;

    doneTaskDiv.appendChild(doneTaskP);
    doneContainer.appendChild(doneTaskDiv);
    doneCount++;
  });
  updateDoneCount();
}

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) {
    window.alert("Task must not be empty!");
    return;
  }

  const newTask = createTaskElement(taskText);
  todoContainer.appendChild(newTask);

  tasks.push(taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  taskCount++;
  updateTaskCount();

  taskInput.value = '';
}

// Function to complete a task
function completeTask(taskElement, taskText) {
  todoContainer.removeChild(taskElement);
  taskCount--;
  updateTaskCount();

  tasks = tasks.filter(task => task !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  doneTasks.push(taskText);
  localStorage.setItem('doneTasks', JSON.stringify(doneTasks));

  const doneTaskDiv = document.createElement('div');
  doneTaskDiv.className = 'frame';

  const doneTaskP = document.createElement('p');
  doneTaskP.innerHTML = `<strike>${taskText}</strike>`;

  doneTaskDiv.appendChild(doneTaskP);
  doneContainer.appendChild(doneTaskDiv);

  doneCount++;
  updateDoneCount();
}

// Function to edit a task
function editTask(taskDiv, oldTaskText) {
  const updatedTask = prompt('Edit your task:', taskDiv.textContent);
  if (updatedTask && updatedTask.trim()) {
    taskDiv.textContent = updatedTask.trim();
    const taskIndex = tasks.indexOf(oldTaskText);
    if (taskIndex > -1) {
      tasks[taskIndex] = updatedTask.trim();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }
}

// Function to delete a task
function deleteTask(taskElement, taskText) {
  taskElement.parentElement.removeChild(taskElement);
  taskCount--;
  updateTaskCount();

  tasks = tasks.filter(task => task !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initial render of tasks from local storage
renderTasks();
