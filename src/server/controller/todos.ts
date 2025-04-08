import { todoRepository } from "@server/repository/todos";
import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";

function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    return res.status(400).json({ error: "Page must be a number" });
  }
  if (query.limit && isNaN(limit)) {
    return res.status(400).json({ error: "Limit must be a number" });
  }

  const output = todoRepository.get({ page, limit });
  res
    .status(200)
    .json({ pages: output.pages, total: output.total, todos: output.todos });
}

const todoCreateSchema = schema.object({
  content: schema.string(),
});

async function create(req: NextApiRequest, res: NextApiResponse) {
  const body = todoCreateSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      error: {
        message: "Content is required.",
        description: body.error.issues,
      },
    });
  }

  const newTodo = await todoRepository.createByContent(body.data.content);
  res.status(201).json({ todo: newTodo });
}

export const todoController = {
  get,
  create,
};
