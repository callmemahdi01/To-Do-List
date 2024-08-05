document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("add");
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");
    const themeToggle = document.getElementById("themeToggle");

    function createTaskElement(text, completed = false, date = null) {
        const li = document.createElement("li");
        if (completed) li.classList.add("completed");

        const task = document.createElement("h3");
        task.textContent = text;
        task.addEventListener("click", () => {
            li.classList.toggle("completed");
            saveToLocalStorage();
        });

        const editBtn = document.createElement("span");
        editBtn.className = "fa fa-pencil";
        editBtn.addEventListener("click", () => startEditing(task, editBtn, li));

        const deleteBtn = document.createElement("span");
        deleteBtn.className = "fa fa-trash-o";
        deleteBtn.addEventListener("click", () => toggleComplete(deleteBtn));
        deleteBtn.addEventListener("mouseleave", () => resetDeleteBtn(deleteBtn));

        const arrowDownBtn = document.createElement("span");
        arrowDownBtn.className = "fa fa-chevron-down";
        arrowDownBtn.addEventListener("click", () => {
            const details = li.querySelector(".task-details");
            if (details) {
                const isOpen = details.style.display === "block";
                details.style.display = isOpen ? "none" : "block";
                arrowDownBtn.className = isOpen ? "fa fa-chevron-down" : "fa fa-chevron-up";
                li.classList.toggle("expanded", !isOpen); // اضافه کردن کلاس expanded
            }
        });

        const details = document.createElement("div");
        details.className = "task-details";

        // استفاده از تاریخ و زمان ایجاد ذخیره شده، در صورت عدم وجود، زمان جاری را استفاده کنید
        const creationTime = date || getCurrentDateTime();
        details.innerHTML = `
            <p class="task-date">${creationTime}</p>
            <!-- می‌توانید اطلاعات اضافی دیگری نیز اضافه کنید -->
        `;

        li.appendChild(task);
        li.appendChild(editBtn);
        li.appendChild(arrowDownBtn);
        li.appendChild(details);
        li.appendChild(deleteBtn);

        return li;
    }

    function getCurrentDateTime() {
        const now = new Date();
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return `Added on: ${now.toLocaleDateString(undefined, options)}`;
    }

    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText !== "") {
            const creationTime = getCurrentDateTime();
            const li = createTaskElement(taskText, false, creationTime);
            todoList.insertBefore(li, todoList.firstChild);
            todoInput.value = "";
            saveToLocalStorage();
        }
    }

    function startEditing(task, editBtn, li) {
        const input = document.createElement("input");
        li.classList.remove("completed")
        input.className = "input";
        input.type = "text";
        input.value = task.textContent;
        li.insertBefore(input, task);
        li.removeChild(task);

        function saveEdit() {
            task.textContent = input.value;
            li.insertBefore(task, input);
            li.removeChild(input);
            editBtn.className = "fa fa-pencil";
            editBtn.textContent = "";
            saveToLocalStorage();
        }

        editBtn.className = "tick";
        editBtn.textContent = "✔";
        editBtn.addEventListener("click", () => {
            saveEdit();
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                input.blur();
                saveEdit();
            }
        });

        input.focus();
    }

    function toggleComplete(deleteBtn) {
        const li = deleteBtn.parentElement;
        if (deleteBtn.classList.contains("fa-trash-o")) {
            deleteBtn.classList.replace("fa-trash-o", "complete");
            deleteBtn.textContent = "✔";
        } else {
            todoList.removeChild(li);
        }
        saveToLocalStorage();
    }

    function resetDeleteBtn(deleteBtn) {
        if (deleteBtn.classList.contains("complete")) {
            deleteBtn.classList.replace("complete", "fa-trash-o");
            deleteBtn.textContent = "";
        }
    }

    function saveToLocalStorage() {
        const todos = Array.from(todoList.children).map((li) => ({
            text: li.querySelector("h4").textContent,
            completed: li.classList.contains("completed"),
            date: li.querySelector(".task-date").textContent
        }));
        localStorage.setItem("todos", JSON.stringify(todos));

        const isDarkMode = document.documentElement.classList.contains("dark-mode");
        localStorage.setItem("theme", JSON.stringify(isDarkMode));
    }

    function loadFromLocalStorage() {
        const todos = JSON.parse(localStorage.getItem("todos")) || [];
        todos.forEach((todo) => {
            const li = createTaskElement(todo.text, todo.completed, todo.date);
            todoList.appendChild(li);
        });

        const isDarkMode = JSON.parse(localStorage.getItem("theme"));
        if (isDarkMode) {
            document.documentElement.classList.add("dark-mode");
            themeToggle.checked = true;
        } else {
            themeToggle.checked = false;
        }
    }

    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });

    themeToggle.addEventListener("change", () => {
        document.documentElement.classList.toggle("dark-mode", themeToggle.checked);
        saveToLocalStorage();
    });

    loadFromLocalStorage();

    // ===============  ثبت service worker  ================

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("./service-worker.js")
                .then((registration) => {
                    console.log("Service Worker registered with scope:", registration.scope);
                })
                .catch((error) => {
                    console.log("Service Worker registration failed:", error);
                });
        });
    }
});
