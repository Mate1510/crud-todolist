async function get() {
  return fetch("/api/todos/").then(async (res) => {
    return JSON.parse(await res.text()).todos;
  });
}

export const todoController = {
  get,
};
