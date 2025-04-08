import fs from "fs";

const DB_PATH_FILE = "./core/db";

interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}

export function create(content: string) {
  const todo: Todo = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  const todos: Todo[] = [...read(), todo];

  fs.writeFileSync(DB_PATH_FILE, JSON.stringify({ todos }, null, 2));

  return todo;
}

export function read() {
  const dbString = fs.readFileSync(DB_PATH_FILE, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) return [];

  return db.todos;
}

function update(id: string, todo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();

  todos.forEach((currentTodo: Todo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, todo);
    }
  });

  if (!updatedTodo) throw new Error("Todo not found");

  fs.writeFileSync(DB_PATH_FILE, JSON.stringify({ todos }, null, 2));

  return updatedTodo;
}

function updateContentById(id: string, content: string) {
  update(id, { content });
}

export function updateStatusById(id: string, done: boolean) {
  return update(id, { done });
}

function deleteById(id: string) {
  const todos = read();

  const todosWhithoutOne = todos.filter((item: Todo) => item.id !== id);

  fs.writeFileSync(
    DB_PATH_FILE,
    JSON.stringify({ todos: todosWhithoutOne }, null, 2),
  );
}

function clear_DB() {
  fs.writeFileSync(DB_PATH_FILE, "");
}

// clear_DB();
// console.log("[CRUD]");
// create("Primeira Todo");
// const secondTodo = create("Segunda Todo");
// const thirdTodo = create("Terceira Todo");
// updateContentById(thirdTodo.id, "Atualizada");
// updateStatusById(thirdTodo.id, true);
// deleteById(secondTodo.id);
// console.log(read());
