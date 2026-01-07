import type { Prisma, Category} from "../generated";
import type { ICategoryRepository } from "../repository/category.repository"

interface FindAllParams {
  page: number
  limit: number
  search?: {
    name?: string,
  }
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface CategoryListRespone{
    category:Category[], 
    total: number, 
    totalPages: number, 
    currentPage: number 
}
export interface ICategoryService {
  getAll(params: FindAllParams) : Promise <CategoryListRespone>
  getCategoryById (id: string): Promise<Category | null>;
}

export class CategoryService implements ICategoryService { 
    constructor (private categoryRepo: ICategoryRepository) {}

       async getAll (params: FindAllParams) : Promise<CategoryListRespone>  {
    const { page, limit, search, sortBy, sortOrder} = params

    const skip = (page - 1 ) * limit
    
    const whereClause : Prisma.CategoryWhereInput = {}

    if (search?.name){whereClause.name = { contains: search.name, mode: "insensitive"}}

    const sortCriteria :  Prisma.CategoryOrderByWithRelationInput = sortBy ? { [sortBy] : sortOrder || "desc" } : {createdAt: "desc"}

    const category = await this.categoryRepo.list(skip, limit, whereClause, sortCriteria)
    
    const total = await this.categoryRepo.countAll(whereClause)


    return { 
      category,
      total, 
      totalPages: Math.ceil( total/limit), 
      currentPage: page }
}


  async getCategoryById (id: string): Promise<Category | null>{  

    const category = await this.categoryRepo.findById(id)
        if (!category) {
         throw new Error ('Category tidak ditemukan')
        }

    return category
}


}
