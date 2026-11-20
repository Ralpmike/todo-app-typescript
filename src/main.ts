import "./style.css";
import type { Todo, Filter } from "./types";
import { loadTodos, saveTodos } from "./storage";
import { getVisibleTodos } from "./todo";
import { fetchSampleTodos } from "./api";

let todos: Todo[] = loadTodos();
let todoIdToBeEdited: string | null = null;
let currentFilter: Filter = "all";

const form = document.querySelector("#todo_form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector("#todos");
const todoSummary = document.querySelector("#todo_summary");
const filters = document.querySelector(".filters");
const loadSamplesButton = document.querySelector("#load_samples");
const errorMessage = document.querySelector("#error_message");

if (
  !(
    form instanceof HTMLFormElement &&
    todoInput instanceof HTMLInputElement &&
    todoList instanceof HTMLUListElement &&
    todoSummary instanceof HTMLParagraphElement &&
    filters instanceof HTMLDivElement &&
    loadSamplesButton instanceof HTMLButtonElement &&
    errorMessage instanceof HTMLParagraphElement
  )
) {
  throw new Error("A required page element is missing or the wrong type");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const todoItem = todoInput.value.trim();

  if (!todoItem) {
    return;
  }

  const newTodo: Todo = {
    todoItem,
    id: crypto.randomUUID(),
    isCompleted: false,
  };

  todos.push(newTodo);

  renderTodos();

  todoInput.value = "";
  saveTodos(todos);
});

const renderTodos = () => {
  todoList.replaceChildren();

  for (const todo of getVisibleTodos(todos, currentFilter)) {
    const li = document.createElement("li");
    li.classList.add("todo_item");
    li.classList.toggle("completed", todo.isCompleted);
    li.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.isCompleted;
    li.appendChild(checkbox);

    checkbox.addEventListener("change", () => {
      todo.isCompleted = !todo.isCompleted;
      saveTodos(todos);
      renderTodos();
    });

    let editInput: HTMLInputElement | null = null;

    if (todo.id === todoIdToBeEdited) {
      editInput = document.createElement("input");
      editInput.classList.add("edited_input");
      editInput.type = "text";
      editInput.value = todo.todoItem;

      li.appendChild(editInput);
    } else {
      const name = document.createElement("span");
      name.textContent = todo.todoItem;
      li.appendChild(name);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Delete";
    li.appendChild(button);

    todoList.appendChild(li);
    editInput?.focus();
  }
  filters.querySelectorAll("button").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      `${button.dataset.filter === currentFilter}`
    );
    button.classList.toggle(
      "selected",
      button.dataset.filter === currentFilter
    );
  });
  const todosLeft =
    todos.length - todos.filter((todoItem) => todoItem.isCompleted).length;

  todoSummary.textContent = `${todosLeft} item${
    todosLeft !== 1 ? "s" : ""
  } left`;
};

renderTodos();

//? Deleting a todo
todoList.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLButtonElement)) {
    return;
  }

  const button = e.target;

  const todoId = button.closest("li")?.dataset.id;
  todos = todos.filter((todo) => todo.id !== todoId);
  saveTodos(todos);
  renderTodos();
});

todoList.addEventListener("dblclick", (e) => {
  if (!(e.target instanceof HTMLSpanElement)) {
    return;
  }

  const todoId = e.target.closest("li")?.dataset.id;
  if (!todoId) {
    return;
  }
  todoIdToBeEdited = todoId;

  renderTodos();
});

todoList.addEventListener("keydown", (e) => {
  if (
    !(
      e.target instanceof HTMLInputElement &&
      e.target.classList.contains("edited_input")
    )
  ) {
    return;
  }
  if (e.key === "Escape") {
    todoIdToBeEdited = null;
    renderTodos();
  }

  if (e.key === "Enter") {
    const inputValue = e.target.value.trim();

    if (!inputValue) {
      renderTodos();
      return;
    }

    const todoEditted = todos.find((todo) => todo.id === todoIdToBeEdited);
    if (!todoEditted) {
      return;
    }

    todoEditted.todoItem = inputValue;

    todoIdToBeEdited = null;
    saveTodos(todos);
    renderTodos();
  }
});

//? Filter logic
filters.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLButtonElement && e.target.dataset.filter)) {
    return;
  }
  const filterTodoType = e.target.dataset.filter;

  if (
    filterTodoType !== "all" &&
    filterTodoType !== "active" &&
    filterTodoType !== "completed"
  ) {
    return;
  }

  currentFilter = filterTodoType;

  renderTodos();
});


loadSamplesButton.addEventListener('click', async () => {
  loadSamplesButton.disabled = true
  loadSamplesButton.textContent = "Loading samples ...."
  errorMessage.textContent = ""
  try {
    const samples = await fetchSampleTodos();
    todos.push(...samples);
    saveTodos(todos);
    renderTodos()
  } catch (error) {
    console.error("Could not load samples:", error)
    errorMessage.textContent = `Could not load samples: Check your connection and try again`
  }finally{
    loadSamplesButton.disabled = false
    loadSamplesButton.textContent = "Load samples"
  }
})