import { Router } from "express";
import { HabitController } from "../controller/habit.controller.js";
import { HabitRepository } from "../repository/habit.repository.js";
import { HabitService } from "../service/habit.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import prismaIntance from "../database.js";
const repo = new HabitRepository(prismaIntance);
const service = new HabitService(repo);
const controller = new HabitController(service);
const router = Router();
router.get("/", authenticate, controller.getAllHabitHandler);
router.get("/:id", authenticate, controller.getHabitByIdHandler);
router.post("/", authenticate, controller.createHabitHandler);
router.put("/:id", authenticate, controller.updateHabitHandler);
router.delete("/:id", authenticate, controller.deleteHabitHandler);
router.put("/api/habits/:id/toggle", authenticate, controller.toggleHabitHandler);
export default router;
//# sourceMappingURL=habit.route.js.map
