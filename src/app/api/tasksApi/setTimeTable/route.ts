import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST(req: Request) {
  try {
    const { timetable } = await req.json();

    if (!Array.isArray(timetable) || timetable.length === 0) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    for (const row of timetable) {
      const existingRow = await prisma.periodTimetable.findUnique({
        where: { rollNo: row.rollNo },
      });

      if (existingRow) {
        // ✅ Update if row exists
        await prisma.periodTimetable.update({
          where: { rollNo: row.rollNo },
          data: {
            startTime: row.startTime,
            endTime: row.endTime,
            type: row.type.toUpperCase(),
          },
        });
      } else {
        // ✅ Create if row does not exist
        await prisma.periodTimetable.create({
          data: {
            rollNo: row.rollNo,
            startTime: row.startTime,
            endTime: row.endTime,
            type: row.type.toUpperCase(),
          },
        });
      }
    }

    return NextResponse.json({ message: "Timetable saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving timetable:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
