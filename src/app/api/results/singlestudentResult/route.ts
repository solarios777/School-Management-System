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

    // Fetch the student's latest year and semester
    const latestResult = await prisma.result.findFirst({
      where: { studentId },
      orderBy: [{ year: "desc" }, { semester: "desc" }], // Get the latest record
      select: { year: true, semester: true },
    });

    if (!latestResult) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    const { year, semester } = latestResult;
    const semesterNumber = Number(semester);

    // Fetch student results
    let results = await prisma.result.findMany({
      where: { studentId },
      include: {
        subject: true, // Include subject details
      },
    });

    // If user is a student or teacher, check if results are released for the specific year/semester
    if (role === "STUDENT" || role === "TEACHER") {
      const resultRelease = await prisma.resultRelease.findFirst({
        where: { year, semester: semesterNumber },
      });

      if (!resultRelease || !resultRelease.isReleased) {
        // Filter out only the results for the restricted year/semester
        results = results.filter(
          (result) => !(result.year === year && result.semester === semester)
        );

        // If no remaining results, return a restricted response
        if (results.length === 0) {
          return NextResponse.json(
            { error: "Results for the latest semester are not yet released." },
            { status: 403 }
          );
        }
      }
    }

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
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
