import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subjectId, selectedSections } = body;

    if (!subjectId || Object.keys(selectedSections).length === 0) {
      return NextResponse.json({ message: "Invalid data submitted" }, { status: 400 });
    }

    const subjectExists = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subjectExists) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    }

    const subjectClassGradesData = [];
    for (const gradeId in selectedSections) {
      const sectionIds = selectedSections[gradeId];

      for (const sectionId of sectionIds) {
        const gradeClass = await prisma.gradeClass.findFirst({
          where: { gradeId, classId: sectionId },
        });

        if (!gradeClass) {
          console.warn(`GradeClass not found for grade: ${gradeId}, section: ${sectionId}`);
          continue;
        }

        subjectClassGradesData.push({
          subjectId,
          gradeClassId: gradeClass.id,
        });
      }
    }

    await prisma.subjectClassGrade.createMany({
      data: subjectClassGradesData,
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Subjects assigned successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error assigning subjects:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
