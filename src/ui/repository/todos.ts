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
  return fetch(`/api/todos/?page=${page}&limit=${limit}`).then(
    async (res): Promise<TodoRepositoryOutput> => {
      return JSON.parse(await res.text()) as TodoRepositoryOutput;
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
  date: Date;
  done: boolean;
}
