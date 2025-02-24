import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    // Parse the request body
    const { teacherId } = await req.json();

    // Validate request
    if (!teacherId) {
      return NextResponse.json(
        { success: false, message: "Missing teacher ID." },
        { status: 400 }
      );
    }

    // Check if the teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found." },
        { status: 404 }
      );
    }

    // Delete related records in a transaction
    await prisma.$transaction([
      prisma.teacherAssignment.deleteMany({ where: { teacherId } }),
      prisma.superviser.deleteMany({ where: { teacherId } }),
      prisma.result.deleteMany({ where: { createdByTeacherId: teacherId } }),
      prisma.result.deleteMany({ where: { updatedByTeacherId: teacherId } }),
    ]);

    // Delete the teacher
    await prisma.teacher.delete({ where: { id: teacherId } });

    return NextResponse.json(
      { success: true, message: "Teacher deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
