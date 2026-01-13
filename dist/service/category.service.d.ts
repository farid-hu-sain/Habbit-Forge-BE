import type { Category } from "../../dist/generated/index.js";
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
export interface CategoryListRespone {
    category: Category[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface ICategoryService {
    getAll(params: FindAllParams): Promise<CategoryListRespone>;
    getCategoryById(id: string): Promise<Category | null>;
}
export declare class CategoryService implements ICategoryService {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    getAll(params: FindAllParams): Promise<CategoryListRespone>;
    getCategoryById(id: string): Promise<Category | null>;
}
export {};
//# sourceMappingURL=category.service.d.ts.map
