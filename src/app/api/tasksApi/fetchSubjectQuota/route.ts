// app/api/fetchSubjectsAndQuotas/route.ts
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

    const formattedData = subjectsAndQuotas.map((item) => ({
      id: item.id,
      subjectName: item.subject.name,
      grade: item.gradeClass.grade.level,
      className: item.gradeClass.class.name,
      weeklyQuota: item.subject.subjectQuota?.weeklyPeriods || 0,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching subjects and quotas:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}