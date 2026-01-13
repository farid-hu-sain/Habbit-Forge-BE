// routes/statsRoutes.ts
import express from "express";
import { getHabitStreak, getMonthlyStats } from "../controller/stat.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();
// Semua endpoint butuh authentication
router.use(authenticate);
// GET /api/habits/:id/streak
router.get("/habits/:id/streak", getHabitStreak);
// GET /api/stats/monthly
router.get("/monthly", getMonthlyStats);
export default router;
//# sourceMappingURL=stat.route.js.map
