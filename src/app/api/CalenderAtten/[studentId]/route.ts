import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseISO, endOfMonth, startOfMonth } from "date-fns";

export async function GET(req: Request, { params }: { params: { studentId: string } }) {
  const { studentId } = params;
  const url = new URL(req.url);
  const month = url.searchParams.get("month");

  // Validate inputs
  if (!studentId) {
    return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
  }

  const startDate = month ? startOfMonth(parseISO(month)) : startOfMonth(new Date());
  const endDate = month ? endOfMonth(parseISO(month)) : endOfMonth(new Date());

  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: studentId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        status: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}
