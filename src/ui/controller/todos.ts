import { todoRepository } from "@ui/repository/todos";

interface Params {
  page?: number;
}

async function get({ page }: Params = {}) {
  return todoRepository.get({
    page: page ?? 1,
    limit: 1,
  });
}

export const todoController = {
  get,
};
