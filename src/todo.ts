import type { Todo, Filter } from "./types";

export function getVisibleTodos(todos: Todo[], currentFilter: Filter): Todo[] {
  switch (currentFilter) {
    case "active":
      return todos.filter((todo) => !todo.isCompleted);
    case "completed":
      return todos.filter((todo) => todo.isCompleted);
    case "all":
      return todos;
    default:
      const unhandled: never = currentFilter;
      throw new Error(`Unknown filter type: ${unhandled}`);
  }
}
