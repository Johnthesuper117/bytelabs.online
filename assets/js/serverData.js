import { neon } from '@netlify/neon';
const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
