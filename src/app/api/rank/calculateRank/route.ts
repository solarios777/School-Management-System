import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Type for request body
interface RankCalculationRequest {
  year: string;
  semester: string; // ✅ Correct, now matches Prisma schema
}

// Type for grouped result from Prisma
interface GroupedResult {
  studentId: string;
  gradeClassId: string;
  _sum: { marks: number | null };
}

// Type for student ranking data
interface StudentRanking {
  studentId: string;
  totalMarks: number;
}

// Type for rank entry in the database
interface RankEntry {
  studentId: string;
  totalMarks: number;
  rank: number;
  semester: string;
  year: string;
}

export async function POST(req: Request) {
  try {
    const { year, semester }: RankCalculationRequest = await req.json();

    if (!year || semester === undefined) {
      return NextResponse.json(
        { error: "Year and semester are required" },
        { status: 400 }
      );
    }

    // Convert semester to string for Result model query
    const semesterString = semester.toString();

    // Fetch total marks per student per class
    const results = (await prisma.result.groupBy({
      by: ["studentId", "gradeClassId"],
      where: { year, semester: semester.toString() }, // Convert semester to string
      _sum: { marks: true },
    })) as unknown as GroupedResult[]; // ✅ Double assertion to ensure it's an array

    // Process rankings per class
    const rankings: Record<string, StudentRanking[]> = results.reduce(
      (acc, result) => {
        const { studentId, gradeClassId, _sum } = result;
        if (_sum.marks === null) return acc;

        if (!acc[gradeClassId]) acc[gradeClassId] = [];
        acc[gradeClassId].push({ studentId, totalMarks: _sum.marks });
        return acc;
      },
      {} as Record<string, StudentRanking[]>
    );

    // Sort and assign ranks within each class
    const rankEntries: RankEntry[] = Object.values(rankings).flatMap(
      (students) => {
        students.sort((a, b) => b.totalMarks - a.totalMarks); // Sort descending

        return students.map((student, index) => ({
          studentId: student.studentId,
          totalMarks: student.totalMarks,
          rank: index + 1,
          semester, // Keep semester as number for Rank model
          year,
        }));
      }
    );

    // Save ranks to DB (Upsert: update if exists, otherwise create)
    for (const rank of rankEntries) {
      await prisma.rank.upsert({
        where: {
          studentId_semester_year: {
            studentId: rank.studentId,
            semester: rank.semester.toString(),
            year: rank.year,
          },
        },
        update: {
          totalMarks: rank.totalMarks,
          rank: rank.rank,
        },
        create: {
          studentId: rank.studentId,
          totalMarks: rank.totalMarks,
          rank: rank.rank,
          semester: rank.semester.toString(),
          year: rank.year,
        },
      });
    }

    return NextResponse.json({ message: "Ranking calculation completed" });
  } catch (error) {
    console.error("Error calculating ranks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
