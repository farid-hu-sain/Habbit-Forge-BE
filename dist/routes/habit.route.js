import { Router } from "express";
import { HabitController } from "../controller/habit.controller.js";
import { HabitRepository } from "../repository/habit.repository.js";
import { HabitService } from "../service/habit.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../utils/validation.js";
import { createHabitValidation, updateHabitValidation } from "../middleware/habit.validation.js";
import prismaInstance from "../database.js";
const repo = new HabitRepository(prismaInstance);
const service = new HabitService(repo);
const controller = new HabitController(service);
const router = Router();
/**
 * @swagger
 * /habit:
 *   get:
 *     summary: Get all habits for current user
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by habit title
 *     responses:
 *       200:
 *         description: List of habits
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, controller.getAllHabitHandler);
/**
 * @swagger
 * /habit:
 *   post:
 *     summary: Create new habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               startDate:
 *                 type : string
 *                 format: date-time
 *                 example: "2026-01-01T00:00:00Z"
 *               frequency:
 *                  type: string
 *                  enum :
 *                   - DAILY
 *                   - WEEKLY
 *                   - MONTHLY
 *                   - YEARLY
 *
 *     responses:
 *       201:
 *         description: Habit created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", authenticate, validate(createHabitValidation), controller.createHabitHandler);
/**
 * @swagger
 * /habit/{id}:
 *   get:
 *     summary: Get habit by ID
 *     tags: [Habits]
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
 *         description: Habit details
 *       404:
 *         description: Habit not found
 */
router.get("/:id", authenticate, controller.getHabitByIdHandler);
/**
 * @swagger
 * /habit/{id}:
 *   put:
 *     summary: Update habit
 *     tags: [Habits]
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
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               isActive:
 *                 type: boolean
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               startDate:
 *                 type : string
 *                 format: date-time
 *                 example: "2026-01-01T00:00:00Z"
 *               frequency:
 *                  type: string
 *                  enum :
 *                   - DAILY
 *                   - WEEKLY
 *                   - MONTHLY
 *                   - YEARLY
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *       404:
 *         description: Habit not found
 */
router.put("/:id", authenticate, validate(updateHabitValidation), controller.updateHabitHandler);
/**
 * @swagger
 * /habit/{id}:
 *   delete:
 *     summary: Delete habit (soft delete)
 *     tags: [Habits]
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
 *         description: Habit deleted successfully
 *       404:
 *         description: Habit not found
 */
router.delete("/:id", authenticate, controller.deleteHabitHandler);
/**
 * @swagger
 * /habit/{id}/toggle:
 *   put:
 *     summary: Toggle habit active status
 *     tags: [Habits]
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
 *         description: Habit status toggled
 *       404:
 *         description: Habit not found
 */
router.put("/:id/toggle", authenticate, controller.toggleHabitHandler);
export default router;
