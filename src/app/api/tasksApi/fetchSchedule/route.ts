import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        teacher: true,
        gradeClass: { include: { grade: true, class: true } },
        subject: true,
      },
    });

    const formattedSchedules = schedules.map((s) => ({
      id: s.id,
      teacherName: s.teacher.name,
      teacherId:s.teacher.id,
      grade: s.gradeClass.grade.level,
      className: s.gradeClass.class.name,
      subject: s.subject.name,
      day: s.day,
      startTime: s.startTime,
      endTime: s.endTime,
    }));
    
    return NextResponse.json(formattedSchedules, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
