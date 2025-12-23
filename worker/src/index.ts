import { createUser, getUser, listUsers, Env } from "./db";

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      // POST /users  -> create user
      if (request.method === "POST" && pathname === "/users") {
        const body = await request.json().catch(() => null);
        if (!body || !body.name || !body.email) {
          return json({ error: "name and email required" }, 400);
        }

        const user = await createUser(env as Env, body.name, body.email);
        return json(user, 201);
      }

      if (request.method === "GET" && /^\/users\/\d+$/.test(pathname)) {
        const idStr = pathname.split("/")[2];
        const id = Number(idStr);

        const user = await getUser(env as Env, id);
        if (!user) {
          return json({ error: "User not found" }, 404);
        }
        return json(user, 200);
      }

      if (request.method === "GET" && pathname === "/users") {
        const users = await listUsers(env as Env);
        return json(users, 200);
      }

      if (request.method === "GET" && pathname === "/health") {
        return json({ status: "ok" }, 200);
      }

      return json({ error: "Not found" }, 404);
    } catch (err: any) {
      console.error(err);
      return json({ error: "Internal server error" }, 500);
    }
  },
} satisfies ExportedHandler<Env>;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
