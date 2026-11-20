export interface Todo {
  todoItem: string;
  readonly id: string;
  isCompleted: boolean;
}

export type Filter = "all" | "active" | "completed";
