document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const clearAllBtn = document.getElementById('clearAll');
  
    let todos = JSON.parse(localStorage.getItem('todo-list')) || [];
  
    function saveTodos() {
      localStorage.setItem('todo-list', JSON.stringify(todos));
    }
  
    function renderTodos() {
      taskList.innerHTML = '';
      todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
          <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
          <div>
            <button class="btn btn-success btn-sm complete-btn" data-index="${index}">✔</button>
            <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">✖</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }
  
    function toggleComplete(index) {
      todos[index].completed = !todos[index].completed;
      saveTodos();
      renderTodos();
    }
  
    function deleteTask(index) {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    }
  
    taskInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter' && taskInput.value.trim() !== '') {
        todos.push({ text: taskInput.value.trim(), completed: false });
        taskInput.value = '';
        saveTodos();
        renderTodos();
      }
    });
  
    clearAllBtn.addEventListener('click', function () {
      todos = [];
      saveTodos();
      renderTodos();
    });
  
    taskList.addEventListener('click', function (e) {
      if (e.target.classList.contains('complete-btn')) {
        const index = e.target.getAttribute('data-index');
        toggleComplete(index);
      } else if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        deleteTask(index);
      }
    });
  
    renderTodos();
  });
  