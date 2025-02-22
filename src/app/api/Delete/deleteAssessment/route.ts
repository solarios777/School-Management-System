import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { year, semester, gradeId, classId, subjectId, examType } = await req.json();

    if (!year || !semester || !gradeId || !classId || !subjectId || !examType) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }
    const gradeClass = await prisma.gradeClass.findFirst({
      where: {
        gradeId,
        classId,
      },
    });

    if (!gradeClass) {
      return NextResponse.json({ success: false, message: "Invalid grade or class." }, { status: 400 });
    }

    const deletedRecords = await prisma.result.deleteMany({
      where: {
        year,
        semester,
        gradeClassId: gradeClass.id,
        subjectId,
        examType,
      },
    });

    if (deletedRecords.count === 0) {
      return NextResponse.json({ success: false, message: "No matching assessment found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Assessment deleted successfully." });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
