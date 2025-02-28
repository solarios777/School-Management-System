import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure this is your Prisma client setup

export async function POST(req: Request) {
  try {
    const { selectedSubjects, selectedSections, weeklyQuota }: {
      selectedSubjects: string[];
      selectedSections: Record<string, string[]>; // Explicitly define type
      weeklyQuota: number;
    } = await req.json();

    for (const subjectId of selectedSubjects) {
      for (const [gradeId, classIds] of Object.entries(selectedSections)) {
        if (!Array.isArray(classIds)) continue; // Ensure classIds is an array

        for (const classId of classIds) {
          // Find the gradeClassId
          const gradeClass = await prisma.gradeClass.findFirst({
            where: { gradeId, classId },
            select: { id: true },
          });

          if (!gradeClass) {
            return NextResponse.json(
              { error: `Grade-Class combination not found for Grade: ${gradeId}, Class: ${classId}` },
              { status: 404 }
            );
          }

          // Check if a quota record already exists
          const existingQuota = await prisma.subjectQuota.findFirst({
            where: {
              subjectId,
              gradeClassId: gradeClass.id,
            },
          });

          if (existingQuota) {
            // Update existing quota
            await prisma.subjectQuota.update({
              where: { id: existingQuota.id },
              data: { weeklyPeriods: weeklyQuota },
            });
          } else {
            // Create a new quota
            await prisma.subjectQuota.create({
              data: {
                subjectId,
                gradeClassId: gradeClass.id,
                weeklyPeriods: weeklyQuota,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({ message: "Subject Quota updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error assigning subject quota:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

