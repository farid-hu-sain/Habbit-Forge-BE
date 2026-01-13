// routes/dashboardRoutes.ts
import express from "express";
import { getDashboard, getTodayHabits, getStats } from "../controller/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();
// Semua route butuh authentication
router.use(authenticate);
// GET /api/dashboard
router.get("/", getDashboard);
// GET /api/dashboard/today
router.get("/today", getTodayHabits);
// GET /api/dashboard/stats
router.get("/stats", getStats);
export default router;
//# sourceMappingURL=dashboard.route.js.map
