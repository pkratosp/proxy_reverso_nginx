const express = require("express");
const faker = require("@faker-js/faker");
const app = express();
const port = 3000;
const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: "mysql-db",
  user: "root",
  password: "root",
  database: "nodedb",
  port: 3306,
});

const query = util.promisify(connection.query).bind(connection);

app.get("/", async (req, res) => {
  const testeTable = await query(
    "SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = 'nodedb' AND table_name = 'people'"
  );

  if (testeTable[0].count === 0) {
    await query(`
      CREATE TABLE people (
        name VARCHAR(255)
      )
    `);
  }

  const randomName = faker.faker.person.fullName();
  await query(`INSERT INTO people (name) VALUES ('${randomName}')`);

  res.send("<h1>Full Cycle Rocks!</h1>");
});

app.get("/list", async (req, res) => {
  const listNames = await query("SELECT * FROM people");
  res.send(listNames);
});

app.listen(port, () => {
  console.log("Rodando na porta " + port);
});
