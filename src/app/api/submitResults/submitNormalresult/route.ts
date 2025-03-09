import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const errors: string[] = [];

  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.role;
    const userId = user.id;

    const body = await req.json();
    if (!Array.isArray(body) || body.length === 0) {
      errors.push("Invalid request data");
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Extract year and semester from the first entry (assuming all entries share the same)
    const { year, semester } = body[0];
    const semesterNumber = Number(semester);

    // Fetch result release deadline for the provided year and semester
    const resultRelease = await prisma.resultRelease.findFirst({
      where: { year, semester: semesterNumber },
    });

    if (resultRelease ) {
     

    const today = new Date();
    const deadline = new Date(resultRelease.deadline);
    const isDeadlinePassed = today > deadline;

    // If role is TEACHER and deadline has passed, prevent submission
    if (role === "TEACHER" && isDeadlinePassed) {
      errors.push("Submission deadline has passed.");
      return NextResponse.json({ error: "Opps! Submission deadline has passed." }, { status: 403 });
    }
  }
    const processedResults = await Promise.all(
      body.map(async (entry) => {
        const { studentId, subjectId, scores, gradeId, classId } = entry;

        // Find the GradeClass ID
        const gradeClass = await prisma.gradeClass.findFirst({
          where: { gradeId, classId },
        });

        if (!gradeClass) {
          errors.push(`Invalid grade or class: ${gradeId} - ${classId}`);
          return NextResponse.json({ error: "Invalid grade or class" }, { status: 400 });
        }

        const grade = await prisma.grade.findUnique({
          where: { id: gradeId },
          select: { level: true },
        });

        const section = await prisma.class.findUnique({
          where: { id: classId },
          select: { name: true },
        });

        if (!grade || !section) {
          errors.push(`Invalid grade or class: ${gradeId} - ${classId}`);
          return NextResponse.json({ error: "Invalid grade or class" }, { status: 400 });
        }

        const student = await prisma.student.findUnique({
          where: { id: studentId },
          select: { name: true },
        });

        if (!student) {
          errors.push(`Student not found: ${studentId}`);
          return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const enrollment = await prisma.enrollment.findFirst({
          where: { studentId, gradeClassId: gradeClass.id },
        });

        if (!enrollment) {
          errors.push(`${student.name} is not enrolled in ${grade.level} ${section.name}`);
          return NextResponse.json({ error: `${student.name} is not enrolled in ${grade.level} ${section.name}` }, { status: 403 });

        }

        // If role is TEACHER, verify their assignment
        if (role === "TEACHER") {
          const assignment = await prisma.teacherAssignment.findFirst({
            where: {
              teacherId: userId,
              gradeClassId: gradeClass.id,
              subjectId,
              year,
              
            },
          });

          if (!assignment) {
            errors.push(`Unauthorized teacher for ${student.name} - Subject`);
            errors.push(`Unauthorized teacher for Grade ${grade.level} ${section.name} - Subject`);
          }
        }

        return Promise.all(
          scores.map(async ({ examType, marks }:any) => {
            const numericMarks = parseFloat(marks) || null;

            const existingResult = await prisma.result.findFirst({
              where: { studentId, subjectId, examType, year },
            });

            if (existingResult) {
              return prisma.result.update({
                where: { id: existingResult.id },
                data: {
                  marks: numericMarks,
                  updatedByTeacherId: role === "TEACHER" ? userId : null,
                  updatedByAdminId: role === "ADMIN" ? userId : null,
                },
              });
            } else {
              return prisma.result.create({
                data: {
                  studentId,
                  subjectId,
                  marks: numericMarks,
                  examType,
                  gradeClassId: gradeClass.id,
                  semester,
                  year,
                  createdByTeacherId: role === "TEACHER" ? userId : null,
                  createdByAdminId: role === "ADMIN" ? userId : null,
                },
              });
            }
          })
        );
      })
    );

    

    return NextResponse.json({ message: "Results saved successfully." });
  } catch (error) {
    console.error("Error:", error);
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
