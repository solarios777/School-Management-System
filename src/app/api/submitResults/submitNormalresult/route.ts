import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Extract unique exam types from the request
    const uniqueExamTypes = Array.from(
      new Set(body.flatMap((result) => result.scores.map((score) => score.examType)))
    );

    // Get existing results (but don't save/update them)
    const existingResults = await prisma.result.findMany({
      where: {
        subjectId: body[0].subjectId,
        semester: body[0].semester,
        year: body[0].year,
        studentId: { in: body.map((r) => r.studentId) },
        examType: { in: uniqueExamTypes },
      },
      select: {
        studentId: true,
        subjectId: true,
        examType: true,
        year: true,
      },
    });

    // Convert existing results to a Set for quick lookup
    const existingResultsSet = new Set(
      existingResults.map(
        (r) => `${r.studentId}-${r.subjectId}-${r.examType}-${r.year}`
      )
    );

    // Prepare the data without saving to the database
    const preparedResults = body.flatMap((result) =>
      result.scores.map((score) => {
        const key = `${result.studentId}-${result.subjectId}-${score.examType}-${result.year}`;

        if (existingResultsSet.has(key)) {
          // Prepare data for update
          return {
            operation: "update",
            studentId: result.studentId,
            subjectId: result.subjectId,
            marks: score.marks,
            examType: score.examType,
            semester: result.semester,
            year: result.year,
            updatedById: userId,
          };
        } else {
          // Prepare data for insert
          return {
            operation: "create",
            studentId: result.studentId,
            subjectId: result.subjectId,
            marks: score.marks,
            examType: score.examType,
            semester: result.semester,
            year: result.year,
            createdById: userId,
          };
        }
      })
    );

    // Log the prepared data in the backend console
    console.log("Prepared Results:", JSON.stringify(preparedResults, null, 2));

    // Return the prepared results to the frontend
    return NextResponse.json({ message: "Prepared results data", data: preparedResults }, { status: 200 });
  } catch (error) {
    console.error("Error preparing results:", error);
    return NextResponse.json({ error: "Failed to prepare results" }, { status: 500 });
  }
}
