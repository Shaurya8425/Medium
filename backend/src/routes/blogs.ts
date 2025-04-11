import { Hono } from "hono";
import { Bindings } from "..";
import { createPrismaClient } from "../prismaClient";
import { verify } from "hono/jwt";
type Variables = {
  userId: string;
};
export const blogsRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

blogsRouter.use("/*", async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    if (!authHeader) {
      return c.json({ message: "Authorization header missing" }, 401);
    }

    const token = authHeader.split(" ")[1]; // Remove 'Bearer ' prefix
    if (!token) {
      return c.json({ message: "Token missing" }, 401);
    }

    const user = await verify(token, c.env.JWT_SECRET);
    if (!user || !user.id) {
      return c.json({ message: "Invalid token" }, 401);
    }

    c.set("userId", String(user.id));
    await next();
  } catch (e) {
    console.error("Auth error:", e);
    return c.json({ message: "Authentication failed" }, 401);
  }
});

// blog apis
blogsRouter.post("/", async (c) => {
  try {
    const prisma = createPrismaClient(c.env);
    const body = await c.req.json();
    const authorId = c.get("userId");

    if (!body.title || !body.content) {
      return c.json({ error: "Title and content are required" }, 400);
    }

    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
    });

    return c.json({
      id: blog.id,
      message: "Blog created successfully"
    }, 201);
  } catch (e) {
    console.error("Error creating blog:", e);
    return c.json({ error: "Failed to create blog post" }, 500);
  }
});

blogsRouter.put("/", async (c) => {
  const prisma = createPrismaClient(c.env);
  const body = await c.req.json();
  const authorId = c.get("userId");
  
  try {
    console.log("Received update request with body:", body); // Log the request body

    if (!body.id) {
      return c.json({ error: "Blog ID is required" }, 400);
    }

    // First check if the blog exists and belongs to the user
    const existingBlog = await prisma.post.findFirst({
      where: { id: body.id }
    });

    console.log("Existing blog:", existingBlog); // Log the existing blog

    if (!existingBlog) {
      return c.json({ error: "Blog not found" }, 404);
    }

    if (existingBlog.authorId !== authorId) {
      return c.json({ error: "Unauthorized to edit this blog" }, 403);
    }

    // Create update data with all fields from the request
    const updateData = {
      title: body.title ?? existingBlog.title, // Keep existing title if not provided
      content: body.content ?? existingBlog.content // Keep existing content if not provided
    };

    console.log("Updating blog with data:", updateData);

    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: updateData,
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        }
      }
    });

    console.log("Updated blog:", blog); // Log the updated blog

    return c.json({
      message: "Blog updated successfully",
      blog
    });
  } catch (e) {
    console.error("Error updating blog:", e);
    return c.json({ 
      error: "Failed to update blog",
      details: e instanceof Error ? e.message : "Unknown error"
    }, 500);
  }
});

blogsRouter.get("/bulk", async (c) => {
  const prisma = createPrismaClient(c.env);
  try {
    console.log("Fetching all blogs");
    const blogs = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        id: 'desc'  // Get newest first
      }
    });
    console.log(`Found ${blogs.length} blogs`);
    return c.json({ 
      status: "success",
      count: blogs.length,
      blogs 
    });
  } catch (e) {
    console.error("Error fetching blogs:", e);
    return c.json({ error: "Failed to fetch blogs" }, 500);
  }
});

blogsRouter.get("/:id", async (c) => {
  const prisma = createPrismaClient(c.env);
  const id = c.req.param("id");

  try {
    console.log("Fetching blog with id:", id);  
    const blog = await prisma.post.findFirst({
      where: {
        id: id
      },
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        }
      }
    });
    
    if (!blog) {
      console.log("Blog not found for id:", id);  
      return c.json({ error: "Blog post not found" }, 404);
    }
    
    console.log("Blog found:", blog);  
    return c.json({ blog });
  } catch (e) {
    console.error("Error fetching blog:", e);
    return c.json({ error: "Failed to fetch blog post" }, 500);
  }
});
