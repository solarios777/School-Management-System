import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure correct Prisma import
import { currentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.role;
    const userId = user.id;
    const studentId = req.nextUrl.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Fetch student details along with enrollments and results
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        name: true,
        username: true,
        surname: true, // Ensure surname is selected
        enrollments: {
          include: {
            gradeClass: {
              include: {
                grade: true, // Fetch the grade details
                class: true, // Fetch the class (section) details
              },
            },
          },
        },
        result: {
          include: { subject: true }, // Include subject details
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get latest result's year and semester
    const latestResult = await prisma.result.findFirst({
      where: { studentId },
      orderBy: [{ year: "desc" }, { semester: "desc" }],
      select: { year: true, semester: true },
    });

    if (!latestResult) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    const { year, semester } = latestResult;
    const semesterNumber = Number(semester);

    let results = student.result;

    // If user is a student or teacher, check if results are released
    if (role === "STUDENT" || role === "TEACHER") {
      const resultRelease = await prisma.resultRelease.findFirst({
        where: { year, semester: semesterNumber },
      });

      if (!resultRelease || !resultRelease.isReleased) {
        results = results.filter(
          (result) => !(result.year === year && result.semester === semester)
        );

        if (results.length === 0) {
          return NextResponse.json(
            { error: "Results for the latest semester are not yet released." },
            { status: 403 }
          );
        }
      }
    }

    // Get grade and section (class)
    const enrollment = student.enrollments[0]; // Assuming one active enrollment
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        name: student.name,
        username: student.username,
        surname: student.surname, // Include surname here
        grade: enrollment.gradeClass.grade.level,
        section: enrollment.gradeClass.class.name,
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
