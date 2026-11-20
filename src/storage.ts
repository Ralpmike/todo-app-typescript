import type { Todo } from "./types";

const STORAGE_KEY = "todos";

export function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function loadTodos(): Todo[] {
  const text = localStorage.getItem(STORAGE_KEY);
  if (!text) {
    return [];
  }
  try {
    const data: unknown = JSON.parse(text);

    if (!isTodoList(data)) {
      return [];
    }

    return data;
  } catch (error) {
    return [];
  }
}

function isTodoList(data: unknown): data is Todo[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "string" &&
        "todoItem" in item &&
        typeof item.todoItem === "string" &&
        "isCompleted" in item &&
        typeof item.isCompleted === "boolean"
    )
  );
}
