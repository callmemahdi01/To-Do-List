document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add');
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');

    // تابع برای افزودن تسک
    function addTask() {
        if (todoInput.value.trim() !== "") {
            const li = document.createElement('li');

            const task = document.createElement('h3');
            task.textContent = todoInput.value;
            task.addEventListener('click', () => {
                li.classList.toggle('completed');
                saveToLocalStorage();
            });

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'fa fa-trash-o'; // کلاس آیکن حذف
            deleteBtn.addEventListener('click', () => {
                todoList.removeChild(li);
                saveToLocalStorage();
            });

            li.appendChild(task);
            li.appendChild(deleteBtn);

            todoList.insertBefore(li, todoList.firstChild); // اضافه کردن تسک به بالای لیست
            todoInput.value = ""; // پاک کردن ورودی
            saveToLocalStorage(); // ذخیره تسک‌ها در localStorage
        }
    }

    // تابع برای ذخیره تسک‌ها در localStorage
    function saveToLocalStorage() {
        const todos = [];
        document.querySelectorAll('#todoList li').forEach(li => {
            todos.push({
                text: li.querySelector('h3').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // تابع برای بارگذاری تسک‌ها از localStorage
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

            if (todo.completed) {
                li.classList.add('completed');
            }

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'fa fa-trash-o'; // کلاس آیکن حذف
            deleteBtn.addEventListener('click', () => {
                todoList.removeChild(li);
                saveToLocalStorage();
            });

            li.appendChild(task);
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    }

    // اضافه کردن تسک با کلیک روی دکمه "Add"
    addButton.addEventListener('click', addTask);

    // اضافه کردن تسک با فشردن کلید Enter
    todoInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // جلوگیری از رفتار پیش‌فرض کلید Enter
            addTask();
        }
    });

    // بارگذاری تسک‌ها از localStorage هنگام بارگذاری صفحه
    loadFromLocalStorage();

    // ثبت Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
});
