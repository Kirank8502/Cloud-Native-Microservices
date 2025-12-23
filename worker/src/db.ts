export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Env {
  DB: D1Database;
}

export async function createUser(env: Env, name: string, email: string) {
  const stmt = env.DB.prepare(
    "INSERT INTO users (name, email) VALUES (?1, ?2) RETURNING id, name, email, created_at"
  ).bind(name, email);

  const result = await stmt.first<User>();
  return result;
}

export async function getUser(env: Env, id: number) {
  const stmt = env.DB.prepare(
    "SELECT id, name, email, created_at FROM users WHERE id = ?1"
  ).bind(id);

  const result = await stmt.first<User>();
  return result;
}

export async function listUsers(env: Env) {
  const stmt = env.DB.prepare(
    "SELECT id, name, email, created_at FROM users ORDER BY id DESC"
  );

  const result = await stmt.all<User>();
  return result.results || [];
}
