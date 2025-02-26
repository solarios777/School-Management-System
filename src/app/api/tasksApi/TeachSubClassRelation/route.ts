import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subjectId, selectedSections, teacherId, year } = body;

    if (!subjectId || Object.keys(selectedSections).length === 0|| !teacherId || !year) {
      return NextResponse.json({ message: "Invalid data submitted" }, { status: 400 });
    }

    const subjectExists = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subjectExists) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    }
     // Check if teacher exists
    const teacherExists = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacherExists) return NextResponse.json({ message: "Teacher not found" }, { status: 404 });


    const TeachsubjectClassGradesData = [];
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

        TeachsubjectClassGradesData.push({
          subjectId,
          gradeClassId: gradeClass.id,
          teacherId: teacherId,
          year
        });
      }
    }

    await prisma.teacherAssignment.createMany({
      data: TeachsubjectClassGradesData,
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Subjects assigned successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error assigning subjects:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
