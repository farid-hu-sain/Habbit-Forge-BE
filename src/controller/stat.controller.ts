import type { Request, Response } from 'express';
import prismaInstance from '../database';

const prisma = prismaInstance;

export const getHabitStreak = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const habitId = req.params.id;
  
  if (!userId || !habitId) return res.status(400).json({ error: 'Bad request' });
  
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) return res.status(404).json({ error: 'Habit not found' });
  
  let streak = 0;
  let date = new Date();
  date.setHours(0, 0, 0, 0);
  
  while (true) {
    const checkIn = await prisma.checkIn.findFirst({
      where: { 
        habitId: habitId as string, // ← TYPE ASSERTION
        date: { gte: date, lt: new Date(date.getTime() + 86400000) }
      }
    });
    if (!checkIn) break;
    streak++;
    date.setDate(date.getDate() - 1);
  }
  
  res.json({ habitId, streak });
};


export const getMonthlyStats = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  
  const habits = await prisma.habit.count({ where: { userId, isActive: true } });
  const checkIns = await prisma.checkIn.count({ where: { userId, date: { gte: firstDay } } });
  
  const days = new Date().getDate();
  const completion = habits > 0 ? Math.round((checkIns / (habits * days)) * 100) : 0;
  
  res.json({ habits, checkIns, completion });
};