import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { gradeId, classId, month } = await request.json();
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

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



// Adjust import path if needed



export async function PATCH(request: Request) {
  try {
    const { studentId, date, status } = await request.json();
    const formattedDate = new Date(date);
    const dayOfMonth = formattedDate.getDate();

    // Check if attendance record exists for the student on the given date
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: formattedDate,
      },
    });

    if (existingAttendance) {
      await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { status },
      });
    } else {
      await prisma.attendance.create({
        data: {
          studentId,
          day: dayOfMonth,
          date: formattedDate,
          status,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
}

