import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { currentUser } from "@/lib/auth";


export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    const role = user?.role;
    const userId = user?.id;

    if (!user || !role || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const semester = searchParams.get("semester");
    const gradeId = searchParams.get("gradeId");
    const classId = searchParams.get("classId");
    const subjectId = searchParams.get("subjectId");

    if (!year || !semester || !gradeId || !classId || !subjectId) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: 400 }
      );
    }

    // Fetch GradeClass ID
    const gradeClass = await prisma.gradeClass.findFirst({
      where: {
        gradeId,
        classId,
      },
    });

    if (!gradeClass) {
      return NextResponse.json(
        { error: "Invalid grade or class selection" },
        { status: 400 }
      );
    }

    // If user is an admin, return all students in the selected grade and class
    if (role === "ADMIN") {
      const students = await prisma.student.findMany({
        where: {
          enrollments: {
            some: {
              gradeClassId: gradeClass.id,
              year: year,
            },
          },
        },
        select: {
          id: true,
          username: true,
          name: true,
          surname: true,
          email: true,
        },
      });

      return NextResponse.json(students);
    }

    // If user is a teacher, check if they are assigned to the selected subject, grade, and class for the given year
    if (role === "TEACHER") {
      const assignment = await prisma.teacherAssignment.findFirst({
        where: {
          teacherId: userId,
          gradeClassId: gradeClass.id,
          subjectId,
          year: year,
        },
      });

      if (!assignment) {
        return NextResponse.json(
          { error: "Unauthorized: You are not assigned to this class and subject for this year." },
          { status: 403 }
        );
      }

      // Fetch students if the teacher is assigned
      const students = await prisma.student.findMany({
        where: {
          enrollments: {
            some: {
              gradeClassId: gradeClass.id,
              year: year,
            },
          },
        },
        select: {
          id: true,
          username: true,
          name: true,
          surname: true,
          email: true,
        },
      });

      return NextResponse.json(students);
    }

    return NextResponse.json(
      { error: "Unauthorized: Only admins and teachers can access this data." },
      { status: 403 }
    );
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
