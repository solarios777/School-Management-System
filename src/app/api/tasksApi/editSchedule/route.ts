// app/api/tasksApi/editSchedule/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { day, startTime, endTime, subjectId, gradeClassId, teacherId, year } = body;

    // Check if a schedule already exists for the given day, time, and grade class
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        gradeClassId,
        day,
        startTime,
        endTime,
        year,
      },
    });

    let schedule;
    if (existingSchedule) {
      // Update the existing schedule
      schedule = await prisma.schedule.update({
        where: { id: existingSchedule.id },
        data: {
          subjectId,
          teacherId,
        },
      });
    } else {
      // Create a new schedule
      schedule = await prisma.schedule.create({
        data: {
          day,
          startTime,
          endTime,
          subjectId,
          gradeClassId,
          teacherId,
          year,
        },
      });
    }

    return NextResponse.json(schedule, { status: 200 });
  } catch (error) {
    console.error("Error handling schedule:", error);
    return NextResponse.json(
      { error: "Failed to handle schedule" },
      { status: 500 }
    );
  }
}