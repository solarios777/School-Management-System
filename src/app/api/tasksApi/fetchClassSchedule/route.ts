// app/api/class-schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gradeClassId = searchParams.get("gradeClassId");

    if (!gradeClassId) {
      return NextResponse.json(
        { error: "Grade Class ID is required" },
        { status: 400 }
      );
    }

    const schedule = await prisma.schedule.findMany({
      where: { gradeClassId },
      include: {
        subject: true,
        teacher: true,
      },
      orderBy: [
        { day: "asc" },
        { startTime: "asc" },
      ],
    });

    const formattedSchedule = schedule.map((entry) => ({
      id: entry.id,
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      subject: entry.subject.name,
      teacherName: entry.teacher.name,
      teacherId: entry.teacher.id,
    }));

    return NextResponse.json(formattedSchedule, { status: 200 });
  } catch (error) {
    console.error("Error fetching class schedule:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}