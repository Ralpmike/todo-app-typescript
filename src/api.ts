import type { Todo } from "./types";

interface ServerTodo {
  id: number;
  title: string;
  completed: boolean;
}

export async function fetchSampleTodos(): Promise<Todo[]> {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=3"
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch todos: ${response.statusText} ${response.status}`
    );
  }

  const data = await response.json();

  if (!isServerTodoList(data)) {
    throw new Error("Unexpected data received from the server");
  }

  return toTodos(data);
}


function isServerTodoList(data: unknown): data is ServerTodo[] {
  return (
    Array.isArray(data) &&
    data.every(
      (todo) =>
        typeof todo === "object" &&
        todo !== null &&
        "id" in todo &&
        typeof todo.id === "number" &&
        "title" in todo &&
        typeof todo.title === "string" &&
        "completed" in todo &&
        typeof todo.completed === "boolean"
    )
  );
}

function toTodos(serverTodos: ServerTodo[]): Todo[] {
  return serverTodos.map((todo) => ({
    id: crypto.randomUUID(), //? Server ids would clash if samples loaded twice
    isCompleted: todo.completed,
    todoItem: todo.title,
  }));
}
