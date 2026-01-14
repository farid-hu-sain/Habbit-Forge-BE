import { Router } from "express";
import { CheckInController } from "../controller/checkIn.controller";
import { CheckInRepository } from "../repository/checkIn.repository";
import { CheckInService } from "../service/checkIn.service";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../utils/validation";
import { createCheckInValidation, updateCheckInValidation } from "../middleware/checkIn.validation";
import prismaInstance from "../database";
const repo = new CheckInRepository(prismaInstance);
const service = new CheckInService(repo);
const controller = new CheckInController(service);
const router = Router();
/**
 * @swagger
 * /checkIn/{id}:
 *   get:
 *     summary: Get check-in by ID
 *     tags: [CheckIns]
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
 *         description: Check-in details
 *       404:
 *         description: Check-in not found
 */
router.get("/:id", authenticate, controller.getCheckInByIdHandler);
/**
 * @swagger
 * /checkIn:
 *   post:
 *     summary: Create daily check-in
 *     tags: [CheckIns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - habitId
 *             properties:
 *               habitId:
 *                 type: string
 *                 format: uuid
 *               note:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Check-in created successfully
 *       400:
 *         description: Already checked in today or habit not active
 *       404:
 *         description: Habit not found
 */
router.post("/", authenticate, validate(createCheckInValidation), controller.createCheckInHandler);
/**
 * @swagger
 * /checkIn/{id}:
 *   put:
 *     summary: Update check-in note
 *     tags: [CheckIns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Check-in updated successfully
 *       404:
 *         description: Check-in not found
 */
router.put("/:id", authenticate, validate(updateCheckInValidation), controller.updateCheckInHandler);
/**
 * @swagger
 * /checkIn/{id}:
 *   delete:
 *     summary: Delete check-in
 *     tags: [CheckIns]
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
 *         description: Check-in deleted successfully
 *       404:
 *         description: Check-in not found
 */
router.delete("/:id", authenticate, controller.deleteCheckInHandler);
export default router;
//# sourceMappingURL=checkIn.route.js.map