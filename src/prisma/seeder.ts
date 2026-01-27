import { Frequency } from "@prisma/client";
import prismaInstance from "../database.js";
import { hash } from "bcrypt";
import {  parseDateFromFE } from "../utils/timeUtils.js";

const prisma = prismaInstance;

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.checkIn.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // 1. Seed SYSTEM Categories (5 template default)
  console.log("📂 Seeding system categories...");

  const systemCategories = [
    {
      id: "cat-healthy",
      name: "Kesehatan",
      description: "Kebiasaan untuk kesehatan fisik & mental",
      color: "#10B981",
      icon: "💊",
      isSystem: true,
    },
    {
      id: "cat-finance",
      name: "Keuangan",
      description: "Kebiasaan pengelolaan keuangan",
      color: "#EF4444",
      icon: "💰",
      isSystem: true,
    },
    {
      id: "cat-work",
      name: "Pekerjaan",
      description: "Kebiasaan produktivitas & pekerjaan",
      color: "#F59E0B",
      icon: "💼",
      isSystem: true,
    },
    {
      id: "cat-learning",
      name: "Belajar",
      description: "Kebiasaan belajar & pengembangan diri",
      color: "#8B5CF6",
      icon: "📚",
      isSystem: true,
    },
    {
      id: "cat-social",
      name: "Sosial",
      description: "Kebiasaan hubungan sosial & keluarga",
      color: "#3B82F6",
      icon: "👥",
      isSystem: true,
    },
  ];

  // Create system categories (userId akan null karena system category)
  for (const category of systemCategories) {
    await prisma.category.create({
      data: category,
    });
  }

  // 2. Seed Users
  console.log("👤 Seeding users...");

  const password = await hash("password123", 10);

  // User 1: John Doe
  const john = await prisma.user.create({
    data: {
      id: "user-john",
      email: "john@example.com",
      username: "johndoe",
      password: password,
      profile: {
        create: {
          fullName: "John Doe",
          bio: "Suka olahraga dan belajar hal baru",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
      },
    },
  });

  // User 2: Jane Smith
  const jane = await prisma.user.create({
    data: {
      id: "user-jane",
      email: "jane@example.com",
      username: "janesmith",
      password: password,
      profile: {
        create: {
          fullName: "Jane Smith",
          bio: "Fokus pada kesehatan dan produktivitas",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
      },
    },
  });

  // 3. Get system categories untuk referensi
  const allCategories = await prisma.category.findMany();

  const getCategory = (name: string) => {
    return allCategories.find((c) => c.name === name && c.isSystem);
  };

  const kesehatanCategory = getCategory("Kesehatan")!;
  const belajarCategory = getCategory("Belajar")!;
  const keuanganCategory = getCategory("Keuangan")!;

  // 4. Seed Habits
  console.log("🎯 Seeding habits...");

  // Helper untuk parse date
  const parseSeedDate = (dateString: string): Date => {
    return parseDateFromFE(dateString);
  };

  // Simple habits data
  const habitsData = [
    // John's habits
    {
      id: "habit-john-001",
      title: "Minum Air 8 Gelas",
      description: "Minum minimal 8 gelas air setiap hari",
      startDate: "2024-01-01",
      frequency: Frequency.DAILY,
      userId: john.id,
      categoryId: kesehatanCategory.id,
    },
    {
      id: "habit-john-002",
      title: "Baca Buku",
      description: "Baca minimal 10 halaman buku setiap hari",
      startDate: "2024-01-03",
      frequency: Frequency.DAILY,
      userId: john.id,
      categoryId: belajarCategory.id,
    },
    // Jane's habits
    {
      id: "habit-jane-001",
      title: "Meditasi Pagi",
      description: "Meditasi 10 menit setiap pagi",
      startDate: "2024-01-04",
      frequency: Frequency.DAILY,
      userId: jane.id,
      categoryId: kesehatanCategory.id,
    },
    {
      id: "habit-jane-002",
      title: "Catat Pengeluaran",
      description: "Mencatat semua pengeluaran harian",
      startDate: "2024-01-05",
      frequency: Frequency.WEEKLY,
      userId: jane.id,
      categoryId: keuanganCategory.id,
    },
  ];

  for (const habit of habitsData) {
    await prisma.habit.create({
      data: {
        ...habit,
        startDate: parseSeedDate(habit.startDate),
      },
    });
  }

  // 5. Seed Simple Check-ins
  console.log("✅ Seeding check-ins...");

  // Helper untuk date
  function getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  function getYesterdayDate(): Date {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return yesterday;
  }

  await prisma.checkIn.createMany({
    data: [
      // John's check-ins
      {
        habitId: "habit-john-001",
        userId: john.id,
        date: getTodayDate(),
        note: "Sudah minum 8 gelas hari ini",
      },
      {
        habitId: "habit-john-002",
        userId: john.id,
        date: getTodayDate(),
        note: "Baca chapter 5",
      },
      {
        habitId: "habit-john-001",
        userId: john.id,
        date: getYesterdayDate(),
        note: null,
      },
      // Jane's check-ins
      {
        habitId: "habit-jane-001",
        userId: jane.id,
        date: getTodayDate(),
        note: "Meditasi pagi hari",
      },
    ],
  });

  // 6. Print Summary
  console.log("\n✨ Seed completed!");
  console.log("====================");
  console.log(`📂 Categories: ${systemCategories.length} system categories`);
  console.log(`👤 Users: 2 (john@example.com / jane@example.com)`);
  console.log(`🎯 Habits: ${habitsData.length} habits`);
  console.log(`✅ Check-ins: 4 check-ins`);
  console.log("\n🔑 Login credentials:");
  console.log("- Email: john@example.com / jane@example.com");
  console.log("- Password: password123");
  console.log("\n🏷️ Category system:");
  console.log(
    "- 5 system categories (Kesehatan, Keuangan, Pekerjaan, Belajar, Sosial)",
  );
  console.log("- User bisa buat kategori custom nanti");
  console.log("\n🚀 Happy coding!");
}

if (!process.env.TZ) {
  process.env.TZ = "Asia/Jakarta";
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
