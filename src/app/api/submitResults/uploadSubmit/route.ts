import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.role;
    const userId = user.id;
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const errors: string[] = [];

    await Promise.all(
      body.map(async (entry) => {
        const { studentusername, studentId: studentName, subjectId, examType, year, semester, scores, gradeId, classId } = entry;
        
        const student = await prisma.student.findFirst({
          where: { username: studentusername, name: studentName },
        });

        if (!student) {
          errors.push(`Student ${studentName} not found`);
          return;
        }

        const gradeClass = await prisma.gradeClass.findFirst({
          where: { gradeId, classId },
        });

        if (!gradeClass) {
          errors.push(`Invalid grade or class for student ${studentName}`);
          return;
        }
         // Fetch the subject name
        
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
            const subject = await prisma.subject.findUnique({
          where: { id: subjectId },
        });

        if (!subject) {
          errors.push(`Invalid subject selection for student ${studentName}`);
          return;
        }
        const grade = await prisma.grade.findUnique({
          where: { id: gradeId },
        });

        if (!grade) {
          errors.push(`Invalid grade selection for student ${studentName}`);
          return;
        }
        const section = await prisma.class.findUnique({
          where: { id: classId },
        });

        if (!section) {
          errors.push(`Invalid section selection for student ${studentName}`);
          return;
        }
             const subjectName = subject.name;
            const gradeLevel = grade.level;
            const className = section.name;

            const errorMessage = `Unauthorized teacher for ${semester} of ${year} for Grade ${gradeLevel}${className} - ${subjectName}`;
if (!errors.includes(errorMessage)) {
  errors.push(errorMessage);
}

          }
        }

        await Promise.all(
          scores.map(async ({ assessmentType, score }) => {
            const numericMarks = parseFloat(score) || null;

            const existingResult = await prisma.result.findFirst({
              where: { studentId: student.id, subjectId, examType: assessmentType, year },
            });

            if (existingResult) {
              await prisma.result.update({
                where: { id: existingResult.id },
                data: {
                  marks: numericMarks,
                  updatedByTeacherId: role === "TEACHER" ? userId : null,
                  updatedByAdminId: role === "ADMIN" ? userId : null,
                },
              });
            } else {
              await prisma.result.create({
                data: {
                  studentId: student.id,
                  subjectId,
                  marks: numericMarks,
                  examType: assessmentType,
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

    if (errors.length > 0) {
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    return NextResponse.json({ message: "Results saved successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
