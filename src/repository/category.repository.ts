import type {  Prisma, PrismaClient, Category } from "../generated";

export interface ICategoryRepository {
    list(
        skip: number,
        take: number,
        where: Prisma.CategoryWhereInput,
        orderBy: Prisma.CategoryOrderByWithRelationInput
    ): Promise<Category[]>;
    countAll(where: Prisma.CategoryWhereInput): Promise<number>;
    findById(id: string): Promise<Category | null>;
    
}

export class CategoryRepository implements ICategoryRepository {
    constructor(private prisma: PrismaClient) { }

    async list(
        skip: number,
        take: number,
        where: Prisma.CategoryWhereInput,
        orderBy: Prisma.CategoryOrderByWithRelationInput
    ): Promise<Category[]> {
        return await this.prisma.category.findMany({
            skip,
            take,
            where,
            orderBy,
            include: { 
                habit: true
             }
        })
    }

    async countAll(where: Prisma.CategoryWhereInput): Promise<number> {
        return await this.prisma.category.count({ where })
    }

    async findById(id: string): Promise<Category | null> {
        return await this.prisma.category.findUnique({
            where: {
                id},
            include: {
                habit: true,
            }
        })
    } 
}
