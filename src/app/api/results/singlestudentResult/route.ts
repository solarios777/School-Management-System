import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure correct Prisma import

export async function GET(req: NextRequest) {
  try {
    const studentId = req.nextUrl.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const results = await prisma.result.findMany({
      where: { studentId },
      include: {
        subject: true, // Include subject details
      },
    });

    // Fetch the student's grade and section (class)
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId },
      include: {
        gradeClass: {
          include: {
            grade: true, // Fetch the grade details
            class: true, // Fetch the class (section) details
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        grade: enrollment.gradeClass.grade.level, // Grade level
        section: enrollment.gradeClass.class.name, // Class (Section) name
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
