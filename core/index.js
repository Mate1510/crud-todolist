const fs = require("fs");
const DB_PATH_FILE = "./core/db";

console.log("[CRUD]");

function create(content) {
  fs.writeFileSync(DB_PATH_FILE, content);
  return content;
}

console.log(create("Hello World"));
