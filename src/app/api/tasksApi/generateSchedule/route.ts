import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, maxWorkload } = body;

    if (!year || !maxWorkload) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    // 1. Fetch all necessary data
    const teacherAssignments = await prisma.teacherAssignment.findMany();
    const subjectQuotas = await prisma.subjectQuota.findMany();
    const periodTimetable = await prisma.periodTimetable.findMany({
      where: { type: "CLASS" },
      orderBy: { rollNo: "asc" },
    });

    // 2. Create a schedule map
    let schedule = [];
    let teacherWorkload: Record<string, number> = {};

    const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

    for (const assignment of teacherAssignments) {
      const { teacherId, gradeClassId, subjectId } = assignment;

      const subjectQuota = subjectQuotas.find((q) => q.subjectId === subjectId && q.gradeClassId === gradeClassId);
      if (!subjectQuota) continue;

      const weeklyPeriods = subjectQuota.weeklyPeriods;
      teacherWorkload[teacherId] = (teacherWorkload[teacherId] || 0) + weeklyPeriods;

      if (teacherWorkload[teacherId] > maxWorkload) continue;

      let assignedPeriods = 0;
      for (const period of periodTimetable) {
        if (assignedPeriods >= weeklyPeriods) break;

        const day = daysOfWeek[period.rollNo % 5];

        // 🔥 **Check if teacher is already assigned for the same period**
        const existingSchedule = await prisma.schedule.findFirst({
          where: {
            teacherId,
            day:day as any,
            startTime: period.startTime,
            endTime: period.endTime,
            year,
          },
        });

        if (!existingSchedule) {
          schedule.push({
            teacherId,
            gradeClassId,
            subjectId,
            day:day as any ,
            startTime: period.startTime,
            endTime: period.endTime,
            year,
          });
          assignedPeriods++;
        }
      }
    }

    // 3. Insert into Schedule Table
    if (schedule.length > 0) {
      await prisma.schedule.createMany({ data: schedule });
    }

    return NextResponse.json({ message: "Schedule generated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error generating schedule:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
