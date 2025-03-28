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

export const todoController = {
  get,
};
