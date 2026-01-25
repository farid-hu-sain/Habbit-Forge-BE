import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import { CategoryRepository } from "../repository/category.repository.js";
import { CategoryService } from "../service/category.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import prismaInstance from "../database.js";

const repo = new CategoryRepository(prismaInstance);
const service = new CategoryService(repo);
const controller = new CategoryController(service);

const router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
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
 *         description: Search by category name
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", authenticate, controller.getAllCategoryHandler);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
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
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get("/:id", authenticate, controller.getCategoryByIdHandler);

export default router;
