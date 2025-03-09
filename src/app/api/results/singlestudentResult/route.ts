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

    // Get all result releases
    const resultReleases = await prisma.resultRelease.findMany();

    // Filter results based on release status
    let results = student.result;

    if (role === "STUDENT" || role === "PARENT") {
      results = results.filter((result) => {
        const release = resultReleases.find(
          (r) =>
            r.year === result.year &&
            r.semester === Number(result.semester)
        );
        return release?.isReleased === true; // Only include results that are released
      });

      if (results.length === 0) {
        return NextResponse.json(
          { error: "No results are available for viewing." },
          { status: 403 }
        );
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