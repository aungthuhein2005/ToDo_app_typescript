interface Todo {
    id: number;
    task: string;
    description: string;
    proiority: string;
    completed: boolean;
}

enum Priority {
    Low = "low",
    Medium = "medium",
    High = "high",
}

const taskInput = document.getElementById("todo-input") as HTMLInputElement;
const descriptionInput = document.getElementById("todo-description") as HTMLInputElement;
const priorityIpunt = document.getElementById("todo-priority") as HTMLSelectElement;
const addButton = document.getElementById("add-button") as HTMLButtonElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const tabBar = document.querySelector(".tab-bar") as HTMLUListElement;
const addForm = document.querySelector("#edit-form") as HTMLFormElement;
const formSave = document.querySelector("#form-save") as HTMLButtonElement;
const formCancel = document.querySelector("#form-cancel") as HTMLButtonElement;
const taskDetail = document.querySelector("#task-detail") as HTMLDivElement;

let todos: Todo[] = [];
let currentFilter: string = "all";

// Load todos from localStorage
window.addEventListener("load", (): void => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodos();
    }
});

function saveTodos(): void {
    localStorage.setItem("todos", JSON.stringify(todos));
}

addButton.addEventListener("click", (): void => {
    addForm.classList.toggle("hidden");
});

formSave.addEventListener("click", (): void => {
    const task: string = taskInput.value.trim();
    const description: string = descriptionInput.value.trim();
    const priority: string = priorityIpunt.value.trim();
    if (task) {
        const newTodo: Todo = {
            id: Date.now(),
            task,
            description,
            proiority: priority,
            completed: false,
        };

        todos.push(newTodo);
        renderTodos();
        saveTodos();
        taskInput.value = "";
        descriptionInput.value = "";
        priorityIpunt.value = "";
        addForm.classList.toggle("hidden");
    }
});

formCancel.addEventListener("click", (): void => {  
    taskInput.value = "";
    descriptionInput.value = "";
    priorityIpunt.value = "";  
    addForm.classList.toggle("hidden");
});



tabBar.addEventListener("click", (event: Event): void => {
    const target = event.target as HTMLAnchorElement;
    if (target.tagName === "A") {
        tabBar.querySelectorAll("a").forEach((tab: HTMLAnchorElement) => tab.classList.remove("text-blue-500"));
        target.classList.add("text-blue-500");
        currentFilter = target.getAttribute("href")!.substring(1);
        console.log(currentFilter);
        renderTodos();
    }
});

function renderDetail(id: number): void{
    taskDetail.innerHTML = "";
    const detailContainer: HTMLDivElement = document.createElement("div");
    const todo = todos.find((todo: Todo): boolean => todo.id === id);
   if(todo){
    const task: HTMLHeadingElement = document.createElement("h2");
    task.textContent = `Task: ${todo.task}`;
    const description: HTMLParagraphElement = document.createElement("p");
    description.textContent = `Description: ${todo.description}`;
    const priority: HTMLParagraphElement = document.createElement("p");
    priority.textContent = `Priority: ${todo.proiority}`;
    const backButton: HTMLButtonElement = document.createElement("button");
    backButton.className = "bg-blue-500 p-1 rounded-sm text-white mx-1";
    backButton.innerHTML = `Back`;
    backButton.addEventListener("click", (): void => {
        taskDetail.classList.toggle("hidden");
        todoList.classList.toggle("hidden");});
    detailContainer.appendChild(task);
    detailContainer.appendChild(description);
    detailContainer.appendChild(priority);
    detailContainer.appendChild(backButton);
    taskDetail.appendChild(detailContainer);

   }
}

function renderTodos(): void {
    todoList.innerHTML = ""; 
    todos
        .filter((todo: Todo): boolean => {
            if (currentFilter === "active") return !todo.completed;
            if (currentFilter === "completed") return todo.completed;
            return true;
        })
        .forEach((todo: Todo): void => {
            const listItem: HTMLLIElement = document.createElement("li");
            listItem.className = `border flex items-center justify-between rounded-lg py-4 px-2 my-2 shadow-md ${todo.completed ? "bg-green-100" : "bg-white"}`;
            const checkButton: HTMLInputElement = document.createElement("input");
            checkButton.type = "checkbox";
            checkButton.checked = todo.completed;
            const taskSpan: HTMLSpanElement = document.createElement("span");
            taskSpan.className = todo.completed ? "line-through" : "";
            taskSpan.textContent = todo.task;

            const taskCheckTitle: HTMLDivElement = document.createElement("div");
            taskCheckTitle.className = "flex items-center gap-2";
            taskCheckTitle.appendChild(checkButton);
            taskCheckTitle.appendChild(taskSpan);

            const buttonContainer: HTMLDivElement = document.createElement("div");

            checkButton.addEventListener("click", (): void => {
                todo.completed = !todo.completed;
                renderTodos();
                saveTodos();
            });

            const detailButton: HTMLButtonElement = document.createElement("button");
            detailButton.className = "bg-yellow-500 p-1 rounded-sm text-white mx-1";
            detailButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>`;
            detailButton.addEventListener("click", (): void => {
                todoList.classList.add("hidden");
                taskDetail.classList.remove("hidden");
                renderDetail(todo.id);
            });

            const deleteButton: HTMLButtonElement = document.createElement("button");
            deleteButton.className = "bg-red-500 p-1 rounded-sm text-white mx-1";
            deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
        `;
            deleteButton.addEventListener("click", (): void => {
                deleteTodo(todo.id);
                saveTodos();
            });

            buttonContainer.appendChild(detailButton);
            buttonContainer.appendChild(deleteButton);

            listItem.appendChild(taskCheckTitle);
            listItem.appendChild(buttonContainer);
            todoList.appendChild(listItem);
        });
}

function deleteTodo(id: number): void {
    todos = todos.filter((todo: Todo): boolean => todo.id !== id);
    renderTodos();
    saveTodos();
}
