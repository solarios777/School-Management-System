// app/api/attendance/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { gradeId, classId, month } = await request.json();

    // Get start and end dates for the selected month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch students and their attendance for the selected month
    const students = await prisma.student.findMany({
      where: {
        enrollments: {
          some: {
            gradeClass: {
              gradeId,
              classId,
            },
          },
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        attendance: {
          where: {
            date: {
              gte: startDate,
              lt: endDate,
            },
          },
          select: {
            day: true,
            date: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

