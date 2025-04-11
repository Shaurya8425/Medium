import { Hono } from "hono";
import { cors } from 'hono/cors';
import { userRouter } from "./routes/user";
import { blogsRouter } from "./routes/blogs";

export type Bindings = {
  DATABASE_URL: string;
  DIRECT_URL: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use('*', cors());

// test api
app.get("/", (c) => {
  console.log("Environment vars:", {
    database_url: c.env.DATABASE_URL,
    direct_url: c.env.DIRECT_URL  
  });
  return c.json({ status: "ok", message: "Server is running" });
});

app.route("/api/v1/user",userRouter);

app.route("/api/v1/blog",blogsRouter);


export default app;
