document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add');
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    const themeToggle = document.getElementById('themeToggle');

    function addTask() {
        if (todoInput.value.trim() !== "") {
            const li = document.createElement('li');

            const task = document.createElement('h3');
            task.textContent = todoInput.value;
            task.addEventListener('click', () => {
                li.classList.toggle('completed');
                saveToLocalStorage();
            });

            const editBtn = document.createElement('span');
            editBtn.className = 'fa fa-pencil';
            editBtn.addEventListener('click', () => {
                startEditing(task, editBtn, li);
            });

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'fa fa-trash-o';
            deleteBtn.addEventListener('click', () => {
                toggleComplete(deleteBtn);
            });

            deleteBtn.addEventListener('mouseleave', () => {
                resetDeleteBtn(deleteBtn);
            });

            li.appendChild(task);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);

            todoList.insertBefore(li, todoList.firstChild);
            todoInput.value = "";
            saveToLocalStorage();
        }
    }

    function startEditing(task, editBtn, li) {
        const input = document.createElement('input');
        input.className = "input"
        input.type = 'text';
        input.value = task.textContent;
        li.insertBefore(input, task);
        li.removeChild(task);

        editBtn.className = 'tick';
        editBtn.textContent = "✔"
        editBtn.addEventListener('click', () => {
            task.textContent = input.value;
            li.insertBefore(task, input);
            li.removeChild(input);
            editBtn.textContent = ""
            editBtn.className = 'fa fa-pencil';
            saveToLocalStorage();
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                input.blur();
            }
        });

        input.focus();
    }

    function toggleComplete(deleteBtn) {
        const li = deleteBtn.parentElement;
        if (deleteBtn.classList.contains('fa-trash-o')) {
            deleteBtn.classList.remove('fa-trash-o');
            deleteBtn.classList.add('complete');
            deleteBtn.textContent = '✔';
        } else {
            todoList.removeChild(li);
        }
        saveToLocalStorage();
    }

    function resetDeleteBtn(deleteBtn) {
        if (deleteBtn.classList.contains('complete')) {
            deleteBtn.classList.remove('complete');
            deleteBtn.textContent = '';
            deleteBtn.classList.add('fa', 'fa-trash-o');
        }
    }

    function saveToLocalStorage() {
        const todos = [];
        document.querySelectorAll('#todoList li').forEach(li => {
            todos.push({
                text: li.querySelector('h3').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('todos', JSON.stringify(todos));

        // Save theme mode
        const isDarkMode = document.getElementsByTagName('html')[0].classList.contains('dark-mode');
        localStorage.setItem('theme', JSON.stringify(isDarkMode));
    }

    function loadFromLocalStorage() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => {
            const li = document.createElement('li');

            const task = document.createElement('h3');
            task.textContent = todo.text;
            task.addEventListener('click', () => {
                li.classList.toggle('completed');
                saveToLocalStorage();
            });

            const editBtn = document.createElement('span');
            editBtn.className = 'fa fa-pencil';
            editBtn.addEventListener('click', () => {
                startEditing(task, editBtn, li);
            });

            if (todo.completed) {
                li.classList.add('completed');
            }

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'fa fa-trash-o';
            deleteBtn.addEventListener('click', () => {
                toggleComplete(deleteBtn);
            });

            deleteBtn.addEventListener('mouseleave', () => {
                resetDeleteBtn(deleteBtn);
            });

            li.appendChild(task);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });

        // Load theme mode
        const isDarkMode = JSON.parse(localStorage.getItem('theme'));
        if (isDarkMode) {
            document.getElementsByTagName('html')[0].classList.add('dark-mode');
            themeToggle.checked = true; // Set checkbox to checked if dark mode is enabled
        } else {
            themeToggle.checked = false; // Ensure checkbox is unchecked if dark mode is not enabled
        }
    }

    addButton.addEventListener('click', addTask);

    todoInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });

    themeToggle.addEventListener('change', () => {
        const isChecked = themeToggle.checked;
        if (isChecked) {
            document.getElementsByTagName('html')[0].classList.add('dark-mode');
        } else {
            document.getElementsByTagName('html')[0].classList.remove('dark-mode');
        }
        saveToLocalStorage(); // Save theme mode on toggle
    });

    loadFromLocalStorage();

    // ثبت Service Worker
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then((registration) => {
                    console.log(
                        "Service Worker registered with scope:",
                        registration.scope
                    );
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        });
    }
});
