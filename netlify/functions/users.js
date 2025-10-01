const { Client } = require("pg");

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const res = await client.query("SELECT * FROM users LIMIT 5");
  await client.end();

  return {
    statusCode: 200,
    body: JSON.stringify(res.rows),
  };
};
