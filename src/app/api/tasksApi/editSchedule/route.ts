import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { day, startTime, endTime, subjectId, gradeClassId, teacherId, year } = body;

    console.log(day,startTime,endTime,subjectId,gradeClassId,teacherId,year);
    

    // Step 1: Find the actual subjectId from the SubjectClassGrade table
    const subjectClassGrade = await prisma.subjectClassGrade.findUnique({
      where: { id: subjectId }, // Use the provided subjectId (which is the id from SubjectClassGrade)
      select: { subjectId: true }, // Select only the subjectId
    });

    if (!subjectClassGrade) {
      return NextResponse.json(
        { error: `SubjectClassGrade with ID ${subjectId} not found` },
        { status: 404 }
      );
    }

    const actualSubjectId = subjectClassGrade.subjectId;
    const existingTeacher=await prisma.schedule.findFirst({
      where:{
        teacherId,
        day,
        startTime,
        endTime
      }
    })
    if(existingTeacher){
      return NextResponse.json({error:"Teacher already has class a this time"},{status:400})
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
          subjectId: actualSubjectId, // Use the actual subjectId
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
          subjectId: actualSubjectId, // Use the actual subjectId
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