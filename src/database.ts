import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import config from "./utils/env.js";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = config.DATABASE_URL;

  const pool = new Pool({
    connectionString:
      connectionString +
      (connectionString.includes("railway.app") ? "?sslmode=no-verify" : ""),
    ...(connectionString.includes("railway") && {
      ssl: { rejectUnauthorized: false },
    }),
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
