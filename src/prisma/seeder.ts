import { Frequency, Category } from "@prisma/client";
import { hash } from "bcrypt";
import {
  parseDateFromFE,
  getTodayDateString,
  getYesterdayDateString,
} from "../utils/timeUtils.js";
import prisma from "../database.js";

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.checkIn.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log("👤 Seeding users...");
  const password = await hash("password123", 10);

  const john = await prisma.user.create({
    data: {
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

  const jane = await prisma.user.create({
    data: {
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

  // Create habits (direct enum assignment)
  console.log("🎯 Seeding habits...");

  // Habit 1: John - Health
  await prisma.habit.create({
    data: {
      title: "Minum Air 8 Gelas",
      description: "Minum minimal 8 gelas air setiap hari",
      startDate: parseDateFromFE("2024-01-01"),
      frequency: Frequency.DAILY,
      userId: john.id,
      category: Category.HEALTH,
    },
  });

  // Habit 2: John - Learning
  await prisma.habit.create({
    data: {
      title: "Baca Buku",
      description: "Baca minimal 10 halaman buku setiap hari",
      startDate: parseDateFromFE("2024-01-03"),
      frequency: Frequency.DAILY,
      userId: john.id,
      category: Category.LEARNING,
    },
  });

  // Habit 3: Jane - Health
  await prisma.habit.create({
    data: {
      title: "Meditasi Pagi",
      description: "Meditasi 10 menit setiap pagi",
      startDate: parseDateFromFE("2024-01-04"),
      frequency: Frequency.DAILY,
      userId: jane.id,
      category: Category.HEALTH,
    },
  });

  // Habit 4: Jane - Finance
  await prisma.habit.create({
    data: {
      title: "Catat Pengeluaran",
      description: "Mencatat semua pengeluaran harian",
      startDate: parseDateFromFE("2024-01-05"),
      frequency: Frequency.WEEKLY,
      userId: jane.id,
      category: Category.FINANCE,
    },
  });

  // Create check-ins
  console.log("✅ Seeding check-ins...");
  const today = new Date(getTodayDateString());
  const yesterday = new Date(getYesterdayDateString());

  // Get habits for check-ins
  const habits = await prisma.habit.findMany();

  const johnHealthHabit = habits.find(
    (h) => h.userId === john.id && h.title.includes("Minum Air"),
  );

  const johnLearningHabit = habits.find(
    (h) => h.userId === john.id && h.title.includes("Baca Buku"),
  );

  const janeHealthHabit = habits.find(
    (h) => h.userId === jane.id && h.title.includes("Meditasi"),
  );

  if (johnHealthHabit) {
    await prisma.checkIn.create({
      data: {
        habitId: johnHealthHabit.id,
        userId: john.id,
        date: today,
        note: "Sudah minum 8 gelas hari ini",
      },
    });

    await prisma.checkIn.create({
      data: {
        habitId: johnHealthHabit.id,
        userId: john.id,
        date: yesterday,
        note: null,
      },
    });
  }

  if (johnLearningHabit) {
    await prisma.checkIn.create({
      data: {
        habitId: johnLearningHabit.id,
        userId: john.id,
        date: today,
        note: "Baca chapter 5",
      },
    });
  }

  if (janeHealthHabit) {
    await prisma.checkIn.create({
      data: {
        habitId: janeHealthHabit.id,
        userId: jane.id,
        date: today,
        note: "Meditasi pagi hari",
      },
    });
  }

  // Summary
  console.log("\n✨ Seed completed!");
  console.log("📂 Categories: 5 enum values");
  console.log("👤 Users: 2 (john@example.com, jane@example.com)");
  console.log("🎯 Habits: 4 habits");
  console.log("✅ Check-ins: 4 check-ins");
  console.log("\n🔑 Password: password123");
}

// Timezone
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
