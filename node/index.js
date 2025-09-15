const express = require("express");
const pg = require("pg");
const faker = require("@faker-js/faker");
const app = express();
const port = 3000;

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new pg.Client({
    host: "localhost",
    port: "5432",
    user: "root",
    database: "nodedb",
    password: "root",
    ssl: false,
  });
  await client.connect();
  return client;
}

app.get("/", async (req, res) => {
  const testeTable = await query(
    `select * from pg_tables where tablename like 'people'`
  );

  if (testeTable.rows.length == 1) {
    const randomName = faker.faker.person.fullName();

    await query(`INSERT INTO people (name) VALUES ('${randomName}')`);
  } else {
    await query(`
      CREATE TABLE people (
        name VARCHAR(255)
      )
    `);
  }

  res.send("<h1>Full Cycle Rocks!</h1>");
});

app.get("/list", async (req, res) => {
  const listNames = await query("SELECT * FROM people");

  res.send(listNames.rows);
});

app.listen(port, () => {
  console.log("Rodando na porta " + port);
});
