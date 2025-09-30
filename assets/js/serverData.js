import { neon } from '@netlify/neon';
const sql = neon(process.env.DATABASE_URL);
const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;

// Example Node.js Netlify Function
const { Pool } = require('pg');

exports.handler = async (event, context) => {
    const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL, // Set this in Netlify
    });

    try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM your_table');
    client.release();
    return {
        statusCode: 200,
        body: JSON.stringify(result.rows),
    };
    } catch (error) {
    console.error('Database error:', error);
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
    }
};

require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");

const requestHandler = async (req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};

http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});