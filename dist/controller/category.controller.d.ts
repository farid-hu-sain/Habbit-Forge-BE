import type { Request, Response } from "express";
import type { ICategoryService } from "../service/category.service.js";
export interface ICategoryController {
    getAllCategoryHandler(req: Request, res: Response): Promise<void>;
    getCategoryByIdHandler(req: Request, res: Response): Promise<void>;
}
export declare class CategoryController implements ICategoryController {
    private categoryService;
    constructor(categoryService: ICategoryService);
    getAllCategoryHandler(req: Request, res: Response): Promise<void>;
    getCategoryByIdHandler(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=category.controller.d.ts.map
