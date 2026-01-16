import type { Category } from "@prisma/client";
import type { ICategoryRepository } from "../repository/category.repository.js";
interface FindAllParams {
    page: number;
    limit: number;
    search?: {
        name?: string;
    };
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
export interface CategoryListResponse {
    category: Category[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface ICategoryService {
    getAll(params: FindAllParams): Promise<CategoryListResponse>;
    getCategoryById(id: string): Promise<Category>;
}
export declare class CategoryService implements ICategoryService {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    getAll(params: FindAllParams): Promise<CategoryListResponse>;
    getCategoryById(id: string): Promise<Category>;
}
export {};
//# sourceMappingURL=category.service.d.ts.map