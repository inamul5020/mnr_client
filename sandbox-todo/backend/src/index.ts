import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mnr_user:mnr_password@localhost:5433/todo_demo'
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/api/todos', async (_req, res) => {
  await pool.query('CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, text TEXT NOT NULL, done BOOLEAN NOT NULL DEFAULT false)');
  const list = await pool.query('SELECT id, text, done FROM todos ORDER BY id DESC');
  res.json(list.rows);
});

app.post('/api/todos', async (req, res) => {
  const { text } = req.body;
  const result = await pool.query('INSERT INTO todos(text, done) VALUES($1, $2) RETURNING id, text, done', [text, false]);
  res.status(201).json(result.rows[0]);
});

const port = Number(process.env.PORT || 4001);
app.listen(port, () => console.log(`Todo backend listening on ${port}`));
