/* eslint-disable no-console */
import fs from "fs";

const DB_PATH_FILE = "./core/db";

interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}

function create(content: string) {
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

function read() {
  const dbString = fs.readFileSync(DB_PATH_FILE, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) return [];

  return db.todos;
}

function update(id: string, todo: Partial<Todo>) {
  const todos = read();

  const todoIndex = todos.findIndex((item: Todo) => item.id === id);

  if (todoIndex === -1) throw new Error("Todo not found");

  todos[todoIndex] = {
    ...todos[todoIndex],
    ...todo,
  };

  fs.writeFileSync(DB_PATH_FILE, JSON.stringify({ todos }, null, 2));
}

function updateContentById(id: string, content: string) {
  update(id, { content });
}

function updateStatusById(id: string, done: boolean) {
  update(id, { done });
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

clear_DB();
console.log("[CRUD]");
create("Primeira Todo");
const secondTodo = create("Segunda Todo");
const thirdTodo = create("Terceira Todo");
updateContentById(thirdTodo.id, "Atualizada");
updateStatusById(thirdTodo.id, true);
deleteById(secondTodo.id);
console.log(read());
