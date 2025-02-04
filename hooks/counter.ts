import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateUsername(userType: 'ST' | 'TR' | 'PR'): Promise<string> {
  const currentYear = parseInt(new Date().getFullYear().toString().slice(-2)); // Get last two digits of the year

  const counter = await prisma.counter.upsert({
    where: { userType },
    update: {
      count: {
        increment: 1,
      },
      year: currentYear, // Update year if not reset
    },
    create: {
      userType,
      count: 1,
      year: currentYear,
    },
  });

  // Reset the counter if the year has changed
  if (counter.year !== currentYear) {
    await prisma.counter.update({
      where: { userType },
      data: {
        count: 1, // Reset count
        year: currentYear, // Update year
      },
    });
    counter.count = 1; // Set the count to 1 for the current user
  }

  const paddedCount = String(counter.count).padStart(4, '0'); // Ensure 4-digit format
  return `${userType}/${paddedCount}/${currentYear}`;
}
