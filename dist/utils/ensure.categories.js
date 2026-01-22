import { PrismaClient } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "../constant/default.categories.js";
const prisma = new PrismaClient();
export async function ensureDefaultCategories() {
    const count = await prisma.category.count();
    if (count > 0)
        return;
    await prisma.category.createMany({
        data: DEFAULT_CATEGORIES,
        skipDuplicates: true,
    });
    console.log("✅ Default categories initialized");
}
