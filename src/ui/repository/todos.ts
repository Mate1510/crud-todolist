interface TodoRepositoryParams {
  page: number;
  limit: number;
}

interface TodoRepositoryOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

async function get({
  page,
  limit,
}: TodoRepositoryParams): Promise<TodoRepositoryOutput> {
  return fetch("/api/todos/").then(
    async (res): Promise<TodoRepositoryOutput> => {
      const ALL_TODOS = JSON.parse(await res.text()).todos;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const todosByPage = ALL_TODOS.slice(startIndex, endIndex);

      const totalPages = Math.ceil(ALL_TODOS.length / limit);

      return {
        todos: todosByPage,
        total: ALL_TODOS.length,
        pages: totalPages,
      };
    },
  );
}

export const todoRepository = {
  get,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  data: Date;
  done: boolean;
}
