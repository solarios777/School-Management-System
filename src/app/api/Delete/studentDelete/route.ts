import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    // Parse the request body
    const { studentId } = await req.json();

    // Validate request
    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Missing student ID." },
        { status: 400 }
      );
    }

    // Check if the student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found." },
        { status: 404 }
      );
    }

    // Delete related records in a transaction
    await prisma.$transaction([
      prisma.enrollment.deleteMany({ where: { studentId } }),
      prisma.attendance.deleteMany({ where: { studentId } }),
      prisma.result.deleteMany({ where: { studentId } }),
      prisma.rank.deleteMany({ where: { studentId } }),
    ]);

    // Delete the student
    await prisma.student.delete({ where: { id: studentId } });

    return NextResponse.json(
      { success: true, message: "Student deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
