import express from "express";
import { getHabitStreak, getMonthlyStats } from "../controller/stat.controller";
import { authenticate } from "../middleware/auth.middleware";
const router = express.Router();
/**
 * @swagger
 * /stat/habits/{id}/streak:
 *   get:
 *     summary: Get habit streak
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Habit streak data
 *       404:
 *         description: Habit not found
 */
router.get("/habits/:id/streak", authenticate, getHabitStreak);
/**
 * @swagger
 * /stat/monthly:
 *   get:
 *     summary: Get monthly statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly statistics
 */
router.get("/monthly", authenticate, getMonthlyStats);
export default router;
//# sourceMappingURL=stat.route.js.map