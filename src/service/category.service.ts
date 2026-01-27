import type { Prisma, Category } from "@prisma/client";
import type { ICategoryRepository } from "../repository/category.repository.js";

interface FindAllParams {
  page: number;
  limit: number;
  search?: {
    name?: string;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  userId?: string; // 🆕 Filter by user (null for system)
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface ICategoryService {
  // Get all categories (system + user's custom)
  getAll(
    params: FindAllParams,
    currentUserId: string,
  ): Promise<CategoryListResponse>;

  // Get system categories only
  getSystemCategories(): Promise<Category[]>;

  // Get user's custom categories only
  getUserCategories(userId: string): Promise<Category[]>;

  // Get combined (system + user's custom)
  getCombinedCategories(userId: string): Promise<Category[]>;

  getCategoryById(id: string, userId: string): Promise<Category>;

  createCategory(data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    userId: string;
  }): Promise<Category>;

  updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
      icon?: string;
    },
    userId: string,
  ): Promise<Category>;

  deleteCategory(id: string, userId: string): Promise<Category>;
}

export class CategoryService implements ICategoryService {
  constructor(private categoryRepo: ICategoryRepository) {}

  async getAll(
    params: FindAllParams,
    currentUserId: string,
  ): Promise<CategoryListResponse> {
    const { page, limit, search, sortBy, sortOrder, userId } = params;
    const skip = (page - 1) * limit;

    // 🆕 Build where clause: system OR user's custom
    const whereClause: Prisma.CategoryWhereInput = {
      OR: [
        { isSystem: true }, // System categories
        { userId: currentUserId }, // Current user's custom categories
      ],
    };

    // Filter by specific user if provided (admin feature)
    if (userId && userId !== currentUserId) {
      // Only admin should access other user's categories
      whereClause.OR = [
        { isSystem: true },
        { userId }, // Specific user's categories
      ];
    }

    if (search?.name) {
      whereClause.name = { contains: search.name, mode: "insensitive" };
    }

    const sortCriteria: Prisma.CategoryOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "asc" }
      : { name: "asc" };

    const categories = await this.categoryRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria,
    );

    const total = await this.categoryRepo.countAll(whereClause);

    return {
      categories,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getSystemCategories(): Promise<Category[]> {
    return await this.categoryRepo.getSystemCategories();
  }

  async getUserCategories(userId: string): Promise<Category[]> {
    return await this.categoryRepo.getUserCategories(userId);
  }

  async getCombinedCategories(userId: string): Promise<Category[]> {
    const [systemCategories, userCategories] = await Promise.all([
      this.getSystemCategories(),
      this.getUserCategories(userId),
    ]);

    return [...systemCategories, ...userCategories];
  }

  async getCategoryById(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepo.findById(id);

    if (!category) {
      throw new Error("Kategori tidak ditemukan");
    }

    // 🆕 Permission check: system category (bisa diakses semua) atau user's own category
    if (category.isSystem || category.userId === userId) {
      return category;
    }

    throw new Error("Akses ditolak");
  }

  async createCategory(data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    userId: string;
  }): Promise<Category> {
    // Validasi input
    if (!data.name || data.name.trim().length < 2) {
      throw new Error("Nama kategori minimal 2 karakter");
    }

    // 🆕 Cek duplikasi: nama harus unique per user
    const existingCategory = await this.categoryRepo.findByNameAndUser(
      data.name,
      data.userId,
    );

    if (existingCategory) {
      throw new Error(`Kategori "${data.name}" sudah ada`);
    }

    const categoryData: Prisma.CategoryCreateInput = {
      name: data.name.trim(),
      description: data.description?.trim() || null,
      color: data.color || "#6B7280", // Default gray
      icon: data.icon || "📝", // Default icon
      isSystem: false, // Always false for user-created
      user: { connect: { id: data.userId } },
    };

    return await this.categoryRepo.create(categoryData);
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
      icon?: string;
    },
    userId: string,
  ): Promise<Category> {
    // 🆕 Validasi: hanya user's custom category yang bisa di-update
    const category = await this.getCategoryById(id, userId);

    if (category.isSystem) {
      throw new Error("Kategori sistem tidak bisa diubah");
    }

    // Jika update name, cek duplikasi
    if (data.name && data.name !== category.name) {
      const existingCategory = await this.categoryRepo.findByNameAndUser(
        data.name,
        userId,
      );

      if (existingCategory) {
        throw new Error(`Kategori "${data.name}" sudah ada`);
      }
    }

    const updateData: Prisma.CategoryUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }
    if (data.description !== undefined) {
      updateData.description = data.description.trim() || null;
    }
    if (data.color !== undefined) {
      updateData.color = data.color;
    }
    if (data.icon !== undefined) {
      updateData.icon = data.icon;
    }

    return await this.categoryRepo.update(id, updateData);
  }

  async deleteCategory(id: string, userId: string): Promise<Category> {
    const category = await this.getCategoryById(id, userId);

    if (category.isSystem) {
      throw new Error("Kategori sistem tidak bisa dihapus");
    }

    const categoryWithHabits = category as Category & { habit?: any[] };

    if (categoryWithHabits.habit && categoryWithHabits.habit.length > 0) {
      throw new Error(
        "Kategori tidak bisa dihapus karena masih digunakan oleh habits",
      );
    }

    return await this.categoryRepo.delete(id);
  }
}
