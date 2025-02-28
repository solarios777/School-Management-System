import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedSubjects, selectedSections } = body;

    if (!selectedSubjects.length || Object.keys(selectedSections).length === 0) {
      return NextResponse.json({ message: "Invalid data submitted" }, { status: 400 });
    }

    const subjectClassGradesData = [];

    for (const subjectId of selectedSubjects) {
      for (const gradeId in selectedSections) {
        const sectionIds = selectedSections[gradeId];

        for (const sectionId of sectionIds) {
          const gradeClass = await prisma.gradeClass.findFirst({
            where: { gradeId, classId: sectionId },
          });

          if (!gradeClass) continue;

          subjectClassGradesData.push({
            subjectId,
            gradeClassId: gradeClass.id,
          });
        }
      }
    }

    await prisma.subjectClassGrade.createMany({
      data: subjectClassGradesData,
      skipDuplicates: true, // Prevent duplicates
    });

    return NextResponse.json({ message: "Subjects assigned successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error assigning subjects:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
