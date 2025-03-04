import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { day, startTime, endTime, subjectId, gradeClassId, teacherId, year } = body;

    // Step 1: Find the actual subjectId from the SubjectClassGrade table
    const subjectClassGrade = await prisma.subjectClassGrade.findUnique({
      where: { id: subjectId },
      select: { subjectId: true },
    });

    if (!subjectClassGrade) {
      return NextResponse.json(
        { error: `SubjectClassGrade with ID ${subjectId} not found` },
        { status: 404 }
      );
    }

    const actualSubjectId = subjectClassGrade.subjectId;

    // Check if the teacher already has a class at this time in a DIFFERENT grade class
    const existingTeacher = await prisma.schedule.findFirst({
      where: {
        teacherId,
        day,
        startTime,
        endTime,
        NOT: {
          gradeClassId: gradeClassId, // Exclude the current grade class
        },
      },
      include: {
        teacher: true,
        gradeClass: {
          include: {
            grade: true,
            class: true,
          },
        },
      },
    });

    if (existingTeacher) {
      const teacherName = existingTeacher.teacher.name;
      const gradeLevel = existingTeacher.gradeClass.grade.level;
      const className = existingTeacher.gradeClass.class.name;
      const period = existingTeacher.startTime + " - " + existingTeacher.endTime;

      return NextResponse.json(
        {
          error: "Teacher already has a class at this time",
          details: {
            teacherName,
            gradeLevel,
            className,
            day,
            period,
          },
        },
        { status: 400 }
      );
    }

    // Step 2: Check if a schedule already exists for the given day, time, and grade class
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
          subjectId: actualSubjectId,
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
          subjectId: actualSubjectId,
          gradeClassId,
          teacherId,
          year,
        },
      });
    }

    return NextResponse.json({ success: true, schedule }, { status: 200 });
  } catch (error:any) {
    console.error("Error handling schedule:", error);
    return NextResponse.json(
      { error: "Failed to handle schedule", details: error.message },
      { status: 500 }
    );
  }
}