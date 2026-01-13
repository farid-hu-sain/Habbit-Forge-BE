import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import { CategoryRepository } from "../repository/category.repository.js";
import { CategoryService } from "../service/category.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import prismaIntance from "../database.js";
const repo = new CategoryRepository(prismaIntance);
const service = new CategoryService(repo);
const controller = new CategoryController(service);
const router = Router();
router.get("/", authenticate, controller.getAllCategoryHandler);
router.get("/", authenticate, controller.getCategoryByIdHandler);
export default router;
//# sourceMappingURL=category.route.js.map
