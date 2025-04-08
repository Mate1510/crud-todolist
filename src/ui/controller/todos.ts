import { todoRepository } from "@ui/repository/todos";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface Params {
  page: number;
}

async function get({ page }: Params) {
  return todoRepository.get({
    page: page,
    limit: 10,
  });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>,
): Todo[] {
  const homeTodos = todos.filter((todo) => {
    const normalizedSearch = search.toLowerCase();
    const normalizedContent = todo.content.toLowerCase();
    return normalizedContent.includes(normalizedSearch);
  });

  return homeTodos;
}

interface createParams {
  content?: string;
  onError: (customMessage?: string) => void;
  onSuccess: (todo: Todo) => void;
}

function create({ content, onSuccess, onError }: createParams) {
  const parsedParams = schema.string().nonempty().safeParse(content);

  if (!parsedParams.success) {
    onError();
    return;
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError("Erro ao criar ou mostrar TODO");
    });
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
};
