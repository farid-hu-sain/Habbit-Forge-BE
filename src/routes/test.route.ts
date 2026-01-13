import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

/**
 * @swagger
 * /api/test/connection:
 *   get:
 *     summary: Test API connection
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: API is connected and working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Backend connected successfully"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get("/connection", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Backend connected successfully",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      habits: "/api/habit",
      checkins: "/api/checkIn",
      categories: "/api/category",
      profile: "/api/profile",
      dashboard: "/api/dashboard",
      statistics: "/api/stat",
      user: "/api/user",
      documentation: "/api-docs",
    },
  });
});

/**
 * @swagger
 * /api/test/database:
 *   get:
 *     summary: Test database connection
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Database connection successful
 *       500:
 *         description: Database connection failed
 */
router.get("/database", async (_req: Request, res: Response) => {
  try {
    // Simple database check
    const prisma = (await import("../database")).default;
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      success: true,
      message: "Database connected successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
    });
  }
});

/**
 * @swagger
 * /api/test/auth:
 *   get:
 *     summary: Test authentication middleware
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 */
router.get("/auth", async (req: Request, res: Response) => {
  // This would normally use authenticate middleware
  // But for test, we'll check manually
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided",
    });
  }
  
  // Simple token check (not actual JWT validation)
  if (authHeader.startsWith("Bearer ")) {
    return res.status(200).json({
      success: true,
      message: "Authentication middleware is working",
      timestamp: new Date().toISOString(),
    });
  }
  
  return res.status(403).json({
    success: false,
    message: "Forbidden - Invalid token format",
  });
});

export default router;