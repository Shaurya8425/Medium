import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

interface Env {
  DATABASE_URL: string;
  DIRECT_URL: string;
}

export const createPrismaClient = (env: Env) => {
  console.log("Creating PrismaClient with URL:", env.DATABASE_URL);
  
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  return prisma;
};