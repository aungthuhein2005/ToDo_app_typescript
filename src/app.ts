class Todo {
    id: number;
    task: string;
    description: string;
    priority: string; // Corrected the typo from 'proiority' to 'priority'
    completed: boolean;

    constructor(id: number, task: string, description: string, priority: string, completed: boolean) {
        this.id = id;
        this.task = task;
        this.description = description;
        this.priority = priority; // Corrected the typo from 'proiority' to 'priority'
        this.completed = completed;
    }

    isCompleted(): boolean {
        return this.completed;
    }
}

class Task extends Todo {
    constructor(id: number, task: string, description: string, priority: string, completed: boolean) {
        super(id, task, description, priority, completed); // Use inherited properties
    }
}

class Project extends Todo {
    tasks: Task[]; // Corrected the typo 'taks' to 'tasks'

    constructor(id: number, task: string, description: string, priority: string, completed: boolean, tasks: Task[]) {
        super(id, task, description, priority, completed); // Use inherited properties
        this.tasks = tasks; // Add new property specific to Project
    }
}


enum Priority {
    Low = "yellow",
    Medium = "yellow",
    High = "red",
}

const taskInput = document.getElementById("todo-input") as HTMLInputElement;
const descriptionInput = document.getElementById("todo-description") as HTMLTextAreaElement;
const priorityInput = document.getElementById("todo-priority") as HTMLSelectElement; // Corrected the typo from 'priorityIpunt'
const addButton = document.getElementById("add-button") as HTMLButtonElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const projectList = document.getElementById("project-list") as HTMLUListElement; // Corrected the ID
const tabBar = document.querySelector(".tab-bar") as HTMLUListElement;
const addForm = document.querySelector("#edit-form") as HTMLFormElement;
const formSave = document.querySelector("#form-save") as HTMLButtonElement;
const formCancel = document.querySelector("#form-cancel") as HTMLButtonElement;
const taskDetail = document.querySelector("#task-detail") as HTMLDivElement;

const projectInput = document.querySelector("#project-input") as HTMLInputElement;
const projectDescription = document.querySelector("#project-description") as HTMLInputElement;
const projectPriority = document.querySelector("#project-priority") as HTMLSelectElement;

const projectForm = document.getElementById("project-form") as HTMLFormElement;
const projectSaveButton = document.getElementById("project-save") as HTMLButtonElement;
const projectCancelButton = document.getElementById("project-cancel") as HTMLButtonElement;
const addProjectButton = document.querySelector(".add-project-button") as HTMLButtonElement;

let todos: Task[] = [];
let projects: Project[] = [];
let currentFilter: string = "all";

// Load todos from localStorage
window.addEventListener("load", (): void => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodos();
    }
    renderProjects(); // Ensure projects are rendered on load
});

// Load projects from localStorage
window.addEventListener("load", (): void => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
        renderProjects();
    }
});

function saveTodos(): void {
    
    localStorage.setItem("todos", JSON.stringify(todos));
}

function saveProjects(): void {
    localStorage.setItem("projects", JSON.stringify(projects));
}

addButton.addEventListener("click", (): void => {
    addForm.classList.toggle("hidden");
});

formSave.addEventListener("click", (): void => {
    const task: string = taskInput.value.trim();
    const description: string = descriptionInput.value.trim();
    const priority: string = priorityInput.value; // Corrected the typo from 'priorityIpunt'

    
    if (task) {
        const newTodo: Task = new Task(
            Date.now(),
            task,
            description,
            priority, // Corrected the typo from 'proiority'
            false
        );

        todos.push(newTodo);
        renderTodos();
        saveTodos();
        taskInput.value = "";
        descriptionInput.value = "";
        priorityInput.selectedIndex = 0; // Reset to default value
        addForm.classList.toggle("hidden");
    }
});

formCancel.addEventListener("click", (): void => {  
    taskInput.value = "";
    descriptionInput.value = "";
    priorityInput.value = ""; // Corrected the typo from 'priorityIpunt'
    addForm.classList.toggle("hidden");
});

addProjectButton.addEventListener("click", (): void => {
    projectForm.classList.toggle("hidden");
});

projectSaveButton.addEventListener("click", (): void => {
    const task: string = projectInput.value.trim();
    const description: string = projectDescription.value.trim();
    const priority: string = projectPriority.value.trim();
    if (task) {
        const newProject: Project = new Project(
            Date.now(),
            task,
            description,
            priority,
            false,
            []
        );

        projects.push(newProject);
        renderProjects();
        saveProjects();
        projectInput.value = "";
        projectDescription.value = "";
        projectPriority.value = "";
        projectForm.classList.toggle("hidden");
    }
});

projectCancelButton.addEventListener("click", (): void => {
    taskInput.value = "";
    descriptionInput.value = "";
    priorityInput.value = "";
    projectForm.classList.toggle("hidden");
    saveProjects();
});

tabBar.addEventListener("click", (event: Event): void => {
    
    const target = event.target as HTMLAnchorElement;
    if (target.tagName === "A") {
        tabBar.querySelectorAll("a").forEach((tab: HTMLAnchorElement) => tab.classList.remove("text-blue-500"));
        target.classList.add("text-blue-500");
        currentFilter = target.getAttribute("href")!.substring(1);
        renderTodos();
    }
});

function renderDetail(id: number): void {
    taskDetail.innerHTML = "";
    const detailContainer: HTMLDivElement = document.createElement("div");
    const todo = todos.find((todo: Task): boolean => todo.id === id);
    if (todo) {
        const task: HTMLHeadingElement = document.createElement("h2");
        task.textContent = `Task: ${todo.task}`;
        const description: HTMLParagraphElement = document.createElement("p");
        description.textContent = `Description: ${todo.description}`;
        const priority: HTMLParagraphElement = document.createElement("p");
        priority.textContent = `Priority: ${todo.priority}`; // Corrected the typo from 'proiority'
        const backButton: HTMLButtonElement = document.createElement("button");
        backButton.className = "bg-blue-500 p-1 rounded-sm text-white mx-1";
        backButton.innerHTML = `Back`;
        backButton.addEventListener("click", (): void => {
            taskDetail.classList.toggle("hidden");
            todoList.classList.toggle("hidden");
        });
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
        .filter((todo: Task): boolean => {
            if (currentFilter === "active") return !todo.completed;
            if (currentFilter === "completed") return todo.completed;
            return true;
        })
        .forEach((todo: Task): void => {
            const listItem: HTMLLIElement = document.createElement("li");
            listItem.className = `border flex items-center justify-between rounded-lg py-4 px-2 my-2 shadow-md hover:shadow:lg ${todo.completed ? "bg-green-100" : "bg-white"}`;
            const checkButton: HTMLInputElement = document.createElement("input");
            checkButton.type = "checkbox";
            checkButton.className = "circle-checkbox    ";
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
    todos = todos.filter((todo: Task): boolean => todo.id !== id);
    renderTodos();
    saveTodos();
}


 
////////////////projects///////////////////

function editProject(id: number): void {
    const project = projects.find((project: Project) => project.id === id);
    if (project) {
        const newTask = prompt("Edit Task Name:", project.task);
        const newDescription = prompt("Edit Description:", project.description);
        const newPriority = prompt("Edit Priority (High, Medium, Low):", project.priority);

        if (newTask !== null) project.task = newTask;
        if (newDescription !== null) project.description = newDescription;
        if (newPriority !== null) project.priority = newPriority;

        renderProjects();
        saveProjects();
    }
}

function deleteProject(id: number): void {
    projects = projects.filter((project: Project) => project.id !== id);
    renderProjects();
    saveProjects();
}

function renderProjects(): void {
    if (!projectList) return;

    // Clear the current content
    projectList.innerHTML = "";

    // Render each project
    projects.forEach((project: Project): void => {
        const projectHTML = `
        <li class="flex-shrink-0 w-64 cursor-pointer transition ease-in-out delay-15 hover:-translate-y-1 duration-300">
            <div class="border p-2 rounded-md shadow-md relative">
                <button class="absolute top-2 right-2 text-gray-500 p-1 rounded-full hover:bg-gray-100 options-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                    </svg>
                </button>
                <div id="options-menu" class="absolute top-10 right-2 bg-white border rounded-md shadow-md hidden">
                    <button class="block text-left w-full px-2 py-1 text-sm text-gray-700 hover:bg-gray-100" onclick="editProject(${project.id})">Edit</button>
                    <button class="block text-left w-full px-2 py-1 text-sm text-gray-700 hover:bg-gray-100" onclick="deleteProject(${project.id})">Delete</button>
                </div>
                <h3 class="text-md font-bold text-gray-500 my-2 py-2">${project.task}</h3>
                <p class="text-sm text-gray-500">${project.description}</p>

                <span class="mt-2 bg-${project.priority === 'High' ? 'red' : project.priority === 'Medium' ? 'yellow' : 'green'}-100 
             text-${project.priority === 'High' ? 'red' : project.priority === 'Medium' ? 'yellow' : 'green'}-500 
             text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md">
  ${project.priority}
</span>

                <div class="mt-2 text-end">
                    <span class="text-gray-500 text-xs">${project.completed ? "100%" : "80%"}</span>
                    <div class="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                        <div class="bg-blue-600 h-1 rounded-full" style="width: ${project.completed ? "100%" : "50%"}"></div>
                    </div>
                </div>
            </div>
        </li>
        `;
        projectList.innerHTML += projectHTML;
    });

    // Add event listeners for options buttons
    document.querySelectorAll('.options-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const optionsMenu = (event.target as HTMLElement).closest("div")?.querySelector("#options-menu");
            if (!optionsMenu) return;
            optionsMenu.classList.toggle("hidden");

            // Close menu if clicked outside
            document.addEventListener("click", function closeMenu(e) {
                if (!optionsMenu.contains(e.target as Node)) {
                    optionsMenu.classList.add("hidden");
                    document.removeEventListener("click", closeMenu);
                }
            });
        });
    });
}

// Call renderProjects to render the initial list
renderProjects();
