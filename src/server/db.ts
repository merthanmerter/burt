import sql from "bun:sqlite";

const db = sql.open("./db.sqlite");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`);

function seedIfEmpty() {
  const { count } = db.query(`SELECT COUNT(*) as count FROM users`).get() as {
    count: number;
  };

  if (count === 0) {
    const insert = db.query("INSERT INTO users (name) VALUES (?)");
    ["John Doe", "Jane Doe"].forEach((name) => insert.run(name));
  }
}

seedIfEmpty();

export default db;
