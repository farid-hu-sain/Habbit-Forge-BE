import type { Request, Response } from "express";
import type { ICategoryService } from "../service/category.service";
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: ICategoryService);
    getAllCategoryHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCategoryByIdHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=category.controller.d.ts.map