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

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: {
        message: "You must provide a string ID",
      },
    });
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(id);

    res.status(200).json({ todo: updatedTodo });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(404).json({
        error: {
          message: err.message,
        },
      });
    }
  }
}

async function deleteTodo(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  if (!id || typeof id != "string") {
    return res.status(400).json({
      error: {
        message: "You must provide a string ID",
      },
    });
  }

  try {
    const deletedTodo = await todoRepository.deleteTodo(id);

    res.status(200).json({ todo: deletedTodo });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(404).json({
        error: {
          message: err.message,
        },
      });
    }
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteTodo,
};
