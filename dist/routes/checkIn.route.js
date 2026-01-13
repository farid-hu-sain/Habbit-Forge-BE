import { Router } from "express";
import { CheckInController } from "../controller/checkIn.controller.js";
import { CheckInRepository } from "../repository/checkIn.repository.js";
import { CheckInService } from "../service/checkIn.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import prismaIntance from "../database.js";
const repo = new CheckInRepository(prismaIntance);
const service = new CheckInService(repo);
const controller = new CheckInController(service);
const router = Router();
router.get("/:id", authenticate, controller.getCheckInByIdHandler);
router.post("/", authenticate, controller.createCheckInHandler);
router.put("/:id", authenticate, controller.updateCheckInHandler);
router.delete("/:id", authenticate, controller.deleteCheckInHandler);
export default router;
//# sourceMappingURL=checkIn.route.js.map
