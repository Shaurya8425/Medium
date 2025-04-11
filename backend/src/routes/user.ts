import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { createPrismaClient } from "../prismaClient";
import { Bindings } from "..";
import { signupInput } from "@shaurya9154/blogsy-common";
export const userRouter = new Hono<{ Bindings: Bindings }>();

// auth apis

userRouter.post("/signup", async (c) => {
  try {
    const prisma = createPrismaClient(c.env);
    const body = await c.req.json();

    console.log("Validating body:", body); // Log the body before validation

    const validation = signupInput.safeParse(body);
    if (!validation.success) {
      console.log("Validation errors:", validation.error.errors); // Log validation errors
      return c.json(
        {
          message: "Input validation failed",
          errors: validation.error.errors,
        },
        400
      );
    }

    const validatedData = validation.data; // Use the validated data
    console.log("Validated data:", validatedData);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name || null, // name is optional in the schema
        username: validatedData.username, // schema uses username instead of email
        password: validatedData.password,
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    console.log("User created:", user);

    return c.json(
      {
        message: "Signup successful",
        token: jwt,
      },
      201
    );
  } catch (e) {
    console.error("Error creating user:", e);
    if (e instanceof Error) {
      return c.json({ error: e.message }, 403);
    }
    return c.json({ error: "Unknown error occurred" }, 403);
  }
});

userRouter.post("/signin", async (c) => {
  try {
    const prisma = createPrismaClient(c.env);
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });
    if (!user) {
      c.status(403);
      return c.json({ error: "user not found" });
    }
    if (user.password !== body.password) {
      c.status(403);
      return c.json({ error: "password mismatch" });
    }
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    console.error("Error signing in user:", e);
    c.status(500);
    return c.json({ error: "unknown error occurred" });
  }
});

userRouter.get("/me", async (c) => {
  try {
    const prisma = createPrismaClient(c.env);
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      c.status(401);
      return c.json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    interface JWTPayload {
      id: string;
    }
    const payload = (await verify(
      token,
      c.env.JWT_SECRET
    )) as unknown as JWTPayload;

    if (!payload || !payload.id) {
      c.status(401);
      return c.json({ error: "Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found" });
    }

    return c.json(user);
  } catch (e) {
    console.error("Error fetching user:", e);
    if (e instanceof Error) {
      c.status(401);
      return c.json({ error: e.message });
    }
    c.status(500);
    return c.json({ error: "Unknown error occurred" });
  }
});
