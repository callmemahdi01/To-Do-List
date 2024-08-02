document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("add");
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");
    const themeToggle = document.getElementById("themeToggle");

    function addTask() {
        if (todoInput.value.trim() !== "") {
            const li = document.createElement("li");

            const task = document.createElement("h3");
            task.textContent = todoInput.value;
            task.addEventListener("click", () => {
                li.classList.toggle("completed");
                saveToLocalStorage();
            });

            const deleteBtn = document.createElement("span");
            deleteBtn.className = "fa fa-trash-o";
            deleteBtn.addEventListener("click", () => {
                todoList.removeChild(li);
                saveToLocalStorage();
            });

            li.appendChild(task);
            li.appendChild(deleteBtn);

            todoList.insertBefore(li, todoList.firstChild);
            todoInput.value = "";
            saveToLocalStorage();
        }
    }

    function saveToLocalStorage() {
        const todos = [];
        document.querySelectorAll("#todoList li").forEach((li) => {
            todos.push({
                text: li.querySelector("h3").textContent,
                completed: li.classList.contains("completed"),
            });
        });
        localStorage.setItem("todos", JSON.stringify(todos));

        // Save theme mode
        const isDarkMode = document
            .getElementsByTagName("html")[0]
            .classList.contains("dark-mode");
        localStorage.setItem("theme", JSON.stringify(isDarkMode));
    }

    function loadFromLocalStorage() {
        const todos = JSON.parse(localStorage.getItem("todos")) || [];
        todos.forEach((todo) => {
            const li = document.createElement("li");

            const task = document.createElement("h3");
            task.textContent = todo.text;
            task.addEventListener("click", () => {
                li.classList.toggle("completed");
                saveToLocalStorage();
            });

            if (todo.completed) {
                li.classList.add("completed");
            }

            const deleteBtn = document.createElement("span");
            deleteBtn.className = "fa fa-trash-o";
            deleteBtn.addEventListener("click", () => {
                todoList.removeChild(li);
                saveToLocalStorage();
            });

            li.appendChild(task);
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });

        // Load theme mode
        const isDarkMode = JSON.parse(localStorage.getItem("theme"));
        if (isDarkMode) {
            document.getElementsByTagName("html")[0].classList.add("dark-mode");
            themeToggle.checked = true; // Set checkbox to checked if dark mode is enabled
        } else {
            themeToggle.checked = false; // Ensure checkbox is unchecked if dark mode is not enabled
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
        const isChecked = themeToggle.checked;
        if (isChecked) {
            document.getElementsByTagName("html")[0].classList.add("dark-mode");
        } else {
            document
                .getElementsByTagName("html")[0]
                .classList.remove("dark-mode");
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
