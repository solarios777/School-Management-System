import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { studentId: string } }) {
  const { studentId } = params;

  if (!studentId) {
    return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { name: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json({ error: "Failed to fetch student details" }, { status: 500 });
  }
}
