import { Todo, TodoSchema } from "@ui/schema/todo";
import { z as schema } from "zod";

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

async function createByContent(content: string): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create TODO!");
  }

  const serverResponseSchema = schema.object({
    todo: TodoSchema,
  });

  const serverResponseParsed = serverResponseSchema.safeParse(
    await response.json(),
  );

  if (!serverResponseParsed.success) {
    throw new Error("Failed to create TODO");
  }

  const todo = serverResponseParsed.data.todo;
  return todo;
}

export const todoRepository = {
  get,
  createByContent,
};
