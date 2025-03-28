import { read } from "@db-crud-todo";

interface TodoRepositoryParams {
  page: number;
  limit: number;
}

interface TodoRepositoryOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({ page, limit }: TodoRepositoryParams): TodoRepositoryOutput {
  const ALL_TODOS = read();

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const todosByPage = ALL_TODOS.slice(startIndex, endIndex);

  const totalPages = Math.ceil(ALL_TODOS.length / limit);

  return {
    todos: todosByPage,
    total: ALL_TODOS.length,
    pages: totalPages,
  };
}

export const todoRepository = {
  get,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}
