import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    // Extract classId from the request body
    const { classId } = await request.json();

    if (!classId) {
      return NextResponse.json(
        { success: false, message: "GradeClass ID is required." },
        { status: 400 }
      );
    }

    // Step 1: Delete all related entities that depend on GradeClass
    await prisma.subjectQuota.deleteMany({
      where: {
        gradeClassId: classId,
      },
    });

    await prisma.schedule.deleteMany({
      where: {
        gradeClassId: classId,
      },
    });

    await prisma.subjectClassGrade.deleteMany({
      where: {
        gradeClassId: classId,
      },
    });

    await prisma.teacherAssignment.deleteMany({
      where: {
        gradeClassId: classId,
      },
    });

    await prisma.superviser.deleteMany({
      where: {
        gradeClassId: classId,
      },
    });

    await prisma.enrollment.deleteMany({
      where: {
        gradeClassId: classId,
      },
    });

    // Step 2: Delete the GradeClass record
    await prisma.gradeClass.delete({
      where: {
        id: classId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "GradeClass and all related entities deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting GradeClass:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete GradeClass." },
      { status: 500 }
    );
  }
}