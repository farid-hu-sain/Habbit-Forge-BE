import type { Prisma, PrismaClient, Category } from "@prisma/client";

export interface ICategoryRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.CategoryWhereInput,
    orderBy: Prisma.CategoryOrderByWithRelationInput,
  ): Promise<Category[]>;

  countAll(where: Prisma.CategoryWhereInput): Promise<number>;

  findById(id: string): Promise<Category | null>;

  findByNameAndUser(
    name: string,
    userId: string | null,
  ): Promise<Category | null>;

  create(data: Prisma.CategoryCreateInput): Promise<Category>;

  update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;

  delete(id: string): Promise<Category>;

  // Get system categories (isSystem: true, userId: null)
  getSystemCategories(): Promise<Category[]>;

  // Get user's custom categories
  getUserCategories(userId: string): Promise<Category[]>;
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.CategoryWhereInput,
    orderBy: Prisma.CategoryOrderByWithRelationInput,
  ): Promise<Category[]> {
    return await this.prisma.category.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        habit: true,
        user: true,
      },
    });
  }

  async countAll(where: Prisma.CategoryWhereInput): Promise<number> {
    return await this.prisma.category.count({ where });
  }

  async findById(
    id: string,
  ): Promise<(Category & { habit?: any[]; user?: any }) | null> {
    return await this.prisma.category.findUnique({
      where: { id },
      include: {
        habit: true,
        user: true,
      },
    });
  }

  async findByNameAndUser(
    name: string,
    userId: string | null,
  ): Promise<Category | null> {
    if (userId === null) {
      return await this.prisma.category.findFirst({
        where: {
          name,
          userId: null, 
        },
      });
    } else {
      return await this.prisma.category.findUnique({
        where: {
          name_userId: {
            name,
            userId,
          },
        },
      });
    }
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return await this.prisma.category.create({ data });
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return await this.prisma.category.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }

  async getSystemCategories(): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: {
        isSystem: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async getUserCategories(userId: string): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: {
        userId,
        isSystem: false,
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}
