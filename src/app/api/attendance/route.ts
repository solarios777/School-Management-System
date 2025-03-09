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
    

    // Parse the date string into a Date object
    const formattedDate = new Date(date);
    

    // Ensure the date is valid
    if (isNaN(formattedDate.getTime())) {
      throw new Error("Invalid date format");
    }

    // Calculate the start and end of the day for the given date
    const startOfDay = new Date(
      formattedDate.getFullYear(),
      formattedDate.getMonth(),
      formattedDate.getDate()
    );
    const endOfDay = new Date(startOfDay);

    endOfDay.setDate(endOfDay.getDate() + 1);

    // Calculate the correct day of the month
    const dayOfMonth = formattedDate.getDate();

    // Check if attendance record exists for the student on the given date
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (existingAttendance) {
      // Update the existing record without changing the day or date
      await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { status },
      });
    } else {
      // Create a new record with the correct day and date
      await prisma.attendance.create({
        data: {
          studentId,
          day: dayOfMonth, // Use the correct day of the month
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
