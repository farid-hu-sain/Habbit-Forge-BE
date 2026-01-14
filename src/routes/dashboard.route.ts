import express from "express";
import {
  getDashboard,
  getTodayHabits,
  getStats,
} from "../controller/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get("/", authenticate, getDashboard);

/**
 * @swagger
 * /dashboard/today:
 *   get:
 *     summary: Get today's habits with check-in status
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's habits list
 */
router.get("/today", authenticate, getTodayHabits);

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get detailed statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics data
 */
router.get("/stats", authenticate, getStats);

export default router;