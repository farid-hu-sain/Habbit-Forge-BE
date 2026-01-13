import { Router } from "express";
import { HabitController } from "../controller/habit.controller";
import { HabitRepository } from "../repository/habit.repository";
import { HabitService } from "../service/habit.service";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../utils/validation";
import { createHabitValidation, updateHabitValidation } from "../middleware/habit.validation";
import prismaInstance from "../database";

const repo = new HabitRepository(prismaInstance);
const service = new HabitService(repo);
const controller = new HabitController(service);

const router = Router();

/**
 * @swagger
 * /api/habit:
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
 * /api/habit:
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
 *     responses:
 *       201:
 *         description: Habit created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", authenticate, validate(createHabitValidation), controller.createHabitHandler);

/**
 * @swagger
 * /api/habit/{id}:
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
 * /api/habit/{id}:
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
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *       404:
 *         description: Habit not found
 */
router.put("/:id", authenticate, validate(updateHabitValidation), controller.updateHabitHandler);

/**
 * @swagger
 * /api/habit/{id}:
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
 * /api/habit/{id}/toggle:
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