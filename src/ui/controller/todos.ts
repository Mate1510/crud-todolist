import { todoRepository } from "@ui/repository/todos";

interface Params {
  page: number;
}

async function get({ page }: Params) {
  return todoRepository.get({
    page: page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  todos: Array<Todo & { content: string }>,
  search: string,
): Todo[] {
  const homeTodos = todos.filter((todo) => {
    const normalizedContent = todo.content.toLowerCase();
    const normalizedSearch = search.toLowerCase();
    return normalizedContent.includes(normalizedSearch);
  });

  return homeTodos;
}

export const todoController = {
  get,
  filterTodosByContent,
};
