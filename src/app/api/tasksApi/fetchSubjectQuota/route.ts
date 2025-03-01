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

    // Mapping subjects and quotas
    const formattedData = subjectsAndQuotas.map((item) => {
      const quota = subjectQuotas.find(
        (sq) =>
          sq.subjectId === item.subjectId && sq.gradeClassId === item.gradeClassId
      );

      return {
        id: item.id,
        subjectName: item.subject.name,
        grade: item.gradeClass.grade.level,
        className: item.gradeClass.class.name,
        gradeClassId: item.gradeClassId, // Add gradeClassId here
        weeklyQuota: quota ? quota.weeklyPeriods : null, // Assign quota if found
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching subjects and quotas:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
