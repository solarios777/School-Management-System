import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    // Parse the request body
    const { parentId } = await req.json();

    // Validate request
    if (!parentId) {
      return NextResponse.json(
        { success: false, message: "Missing parent ID." },
        { status: 400 }
      );
    }

    // Check if the parent exists
    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      return NextResponse.json(
        { success: false, message: "Parent not found." },
        { status: 404 }
      );
    }

    // Unlink students from the parent (if parentId is directly referenced in Student)
    await prisma.student.updateMany({
      where: { parentId },
      data: { parentId: null },
    });

    // Delete related StudentParent records (junction table for many-to-many relationship)
    await prisma.studentParent.deleteMany({
      where: { parentId },
    });

    // Delete the parent
    await prisma.parent.delete({ where: { id: parentId } });

    return NextResponse.json(
      { success: true, message: "Parent deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting parent:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}