import { Category, Frequency } from "@prisma/client";
import prismaInstance from "../database.js";
import { hash } from "bcrypt";

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

  // 1. Seed Categories - SESUAI DENGAN ENUM
  console.log("📂 Seeding categories...");

  // Buat kategori sesuai enum, dengan type casting yang benar
  const categoriesData = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "HEALTHY" as const,
      description: "Kebiasaan untuk kesehatan fisik & mental",
      color: "#10B981",
      icon: "💊",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "FINANCE" as const,
      description: "Kebiasaan pengelolaan keuangan",
      color: "#EF4444",
      icon: "💰",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "WORK" as const,
      description: "Kebiasaan produktivitas & pekerjaan",
      color: "#F59E0B",
      icon: "💼",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      name: "LEARNING" as const,
      description: "Kebiasaan belajar & pengembangan diri",
      color: "#8B5CF6",
      icon: "📚",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      name: "SOCIAL" as const,
      description: "Kebiasaan hubungan sosial & keluarga",
      color: "#3B82F6",
      icon: "👥",
    },
  ];

  await prisma.category.createMany({
    data: categoriesData,
  });

  // Get category IDs for later use
  const allCategories = await prisma.category.findMany();

  // Helper function untuk find category dengan aman
  const findCategory = (name: string): Category => {
    const category = allCategories.find((c) => c.name === name);
    if (!category) {
      throw new Error(`Category ${name} not found after seeding`);
    }
    return category;
  };

  const healthCategory = findCategory("HEALTHY");
  const financeCategory = findCategory("FINANCE");
  const workCategory = findCategory("WORK");
  const learningCategory = findCategory("LEARNING");

  // 2. Seed Users (with Profiles)
  console.log("👤 Seeding users...");

  const password = await hash("password123", 10);

  // User 1: John Doe
  const john = await prisma.user.create({
    data: {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      email: "john@example.com",
      username: "johndoe",
      password: password,
      profile: {
        create: {
          id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
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
      id: "c3d4e5f6-g7h8-9012-cdef-345678901234",
      email: "jane@example.com",
      username: "janesmith",
      password: password,
      profile: {
        create: {
          id: "d4e5f6g7-h8i9-0123-defg-456789012345",
          fullName: "Jane Smith",
          bio: "Fokus pada kesehatan dan produktivitas",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
      },
    },
  });

  // 3. Seed Habits - TANPA lastCheckIn
  console.log("🎯 Seeding habits...");

  // John's habits - TANPA lastCheckIn
  const johnHabit1 = await prisma.habit.create({
    data: {
      id: "e5f6g7h8-i9j0-1234-efgh-567890123456",
      title: "Minum Air 8 Gelas",
      description: "Minum minimal 8 gelas air setiap hari",
      startDate: new Date("2026-01-01"),
      frequency: Frequency.DAILY,
      userId: john.id,
      categoryId: healthCategory.id,
      // ❌ TIDAK ADA lastCheckIn
    },
  });

  const johnHabit2 = await prisma.habit.create({
    data: {
      id: "f6g7h8i9-j0k1-2345-fghi-678901234567",
      title: "Olahraga Pagi",
      description: "Lari atau workout 30 menit setiap pagi",
      startDate: new Date("2026-01-02"),
      frequency: Frequency.DAILY,
      userId: john.id,
      categoryId: healthCategory.id,
      // ❌ TIDAK ADA lastCheckIn
    },
  });

  const johnHabit3 = await prisma.habit.create({
    data: {
      id: "g7h8i9j0-k1l2-3456-ghij-789012345678",
      title: "Baca Buku",
      description: "Baca minimal 10 halaman buku setiap hari",
      startDate: new Date("2026-01-03"),
      frequency: Frequency.DAILY,
      userId: john.id,
      categoryId: learningCategory.id,
      // ❌ TIDAK ADA lastCheckIn
    },
  });

  // Jane's habits - TANPA lastCheckIn
  const janeHabit1 = await prisma.habit.create({
    data: {
      id: "h8i9j0k1-l2m3-4567-hijk-890123456789",
      title: "Meditasi",
      description: "Meditasi 10 menit setiap pagi",
      userId: jane.id,
      categoryId: healthCategory.id,
      startDate: new Date("2026-01-04"),
      frequency: Frequency.DAILY,
      // ❌ TIDAK ADA lastCheckIn
    },
  });

  const janeHabit2 = await prisma.habit.create({
    data: {
      id: "i9j0k1l2-m3n4-5678-ijkl-901234567890",
      title: "Yoga",
      description: "Yoga 20 menit sebelum tidur",
      userId: jane.id,
      categoryId: healthCategory.id,
      startDate: new Date("2026-01-04"),
      frequency: Frequency.DAILY,
      // ❌ TIDAK ADA lastCheckIn
    },
  });

  const janeHabit3 = await prisma.habit.create({
    data: {
      id: "j0k1l2m3-n4o5-6789-jklm-012345678901",
      title: "Catat Pengeluaran",
      description: "Mencatat semua pengeluaran harian",
      userId: jane.id,
      categoryId: financeCategory.id,
      startDate: new Date("2026-01-05"),
      frequency: Frequency.WEEKLY,
      // ❌ TIDAK ADA lastCheckIn
    },
  });

  const janeHabit4 = await prisma.habit.create({
    data: {
      id: "k1l2m3n4-o5p6-7890-klmn-123456789012",
      title: "Review Weekly Goals",
      description: "Review goals kerja mingguan",
      userId: jane.id,
      categoryId: workCategory.id,
      startDate: new Date("2026-01-06"),
      frequency: Frequency.WEEKLY,
      // ❌ TIDAK ADA lastCheckIn
    },
  });

  const johnHabits = [johnHabit1, johnHabit2, johnHabit3];
  const janeHabits = [janeHabit1, janeHabit2, janeHabit3, janeHabit4];

  // 4. Seed Check-ins (Last 7 days)
  console.log("✅ Seeding check-ins...");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper untuk buat date
  function getDate(daysAgo: number): Date {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  const checkInPromises = [];

  // John's check-ins (lebih konsisten)
  for (let i = 0; i < 7; i++) {
    const date = getDate(i);

    // Habit 1: Minum Air (check-in setiap hari)
    checkInPromises.push(
      prisma.checkIn.create({
        data: {
          habitId: johnHabit1.id,
          userId: john.id,
          date: date,
          note: i === 0 ? "Sudah minum 8 gelas hari ini" : null,
        },
      }),
    );

    // Habit 2: Olahraga (skip weekend - Sabtu & Minggu)
    const dayOfWeek = date.getDay(); // 0 = Minggu, 6 = Sabtu
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      checkInPromises.push(
        prisma.checkIn.create({
          data: {
            habitId: johnHabit2.id,
            userId: john.id,
            date: date,
            note: i === 0 ? "Lari 3km pagi ini" : null,
          },
        }),
      );
    }

    // Habit 3: Baca Buku (check-in 5 dari 7 hari)
    if (i < 5) {
      checkInPromises.push(
        prisma.checkIn.create({
          data: {
            habitId: johnHabit3.id,
            userId: john.id,
            date: date,
            note: i === 0 ? "Baca chapter 5" : null,
          },
        }),
      );
    }
  }

  // Jane's check-ins (sedikit lebih random)
  for (let i = 0; i < 5; i++) {
    const date = getDate(i);

    // Habit 1: Meditasi (4 dari 5 hari)
    if (i !== 2) {
      checkInPromises.push(
        prisma.checkIn.create({
          data: {
            habitId: janeHabit1.id,
            userId: jane.id,
            date: date,
            note: i === 0 ? "Meditasi pagi hari" : null,
          },
        }),
      );
    }

    // Habit 2: Yoga (3 dari 5 hari)
    if (i === 0 || i === 2 || i === 4) {
      checkInPromises.push(
        prisma.checkIn.create({
          data: {
            habitId: janeHabit2.id,
            userId: jane.id,
            date: date,
            note: i === 0 ? "Yoga sebelum tidur" : null,
          },
        }),
      );
    }

    // Habit 4: Networking (1x per minggu)
    if (i === 0) {
      checkInPromises.push(
        prisma.checkIn.create({
          data: {
            habitId: janeHabit4.id,
            userId: jane.id,
            date: date,
            note: "Coffee chat dengan senior developer",
          },
        }),
      );
    }
  }

  await Promise.all(checkInPromises);

  // 5. Print Summary
  console.log("\n✨ Seed completed!");
  console.log("====================");
  console.log(
    `📂 Categories: ${categoriesData.length} (HEALTHY, FINANCE, WORK, LEARNING, SOCIAL)`,
  );
  console.log(`👤 Users: 2 (john@example.com / jane@example.com)`);
  console.log(`🎯 Habits: ${johnHabits.length + janeHabits.length}`);
  console.log(`✅ Check-ins: ${checkInPromises.length}`);
  console.log("\n🔑 Login credentials:");
  console.log("- Email: john@example.com / jane@example.com");
  console.log("- Password: password123");
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
