import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const subjectsAndQuotas = await prisma.subjectClassGrade.findMany({
      include: {
        subject: true,
        gradeClass: {
          include: {
            grade: true,
            class: true,
          },
        },
      },
    });

    // Fetching subject quotas separately
    const subjectQuotas = await prisma.subjectQuota.findMany();

    // Fetching teacher assignments separately
    const teacherAssignments = await prisma.teacherAssignment.findMany({
      include: {
        teacher: true, // Include teacher details
      },
    });

    // Mapping subjects, quotas, and teacher assignments
    const formattedData = subjectsAndQuotas.map((item) => {
      const quota = subjectQuotas.find(
        (sq) =>
          sq.subjectId === item.subjectId && sq.gradeClassId === item.gradeClassId
      );

      const teacherAssignment = teacherAssignments.find(
        (ta) =>
          ta.subjectId === item.subjectId && ta.gradeClassId === item.gradeClassId
      );

      return {
        id: item.id,
        subjectName: item.subject.name,
        grade: item.gradeClass.grade.level,
        className: item.gradeClass.class.name,
        gradeClassId: item.gradeClassId,
        weeklyQuota: quota ? quota.weeklyPeriods : null,
        teacherName: teacherAssignment ? `${teacherAssignment.teacher.name} ${teacherAssignment.teacher.surname}` : "Unassigned",
        teacherId: teacherAssignment ? teacherAssignment.teacher.id : "Unassigned",
      };
    });

    
    

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching subjects, quotas, and teacher assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
