import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { timetable } = await req.json();

    if (!Array.isArray(timetable) || timetable.length === 0) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Step 1: Delete all existing records in the PeriodTimetable table
    await prisma.periodTimetable.deleteMany();

    // Step 2: Insert the new data
    const createdTimetable = await prisma.periodTimetable.createMany({
      data: timetable.map(row => ({
        rollNo: row.rollNo,
        startTime: row.startTime,
        endTime: row.endTime,
        type: row.type.toUpperCase(),
      })),
    });

    return NextResponse.json({ message: "Timetable saved successfully", data: createdTimetable }, { status: 201 });
  } catch (error) {
    console.error("Error saving timetable:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}