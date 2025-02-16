import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import moment from "moment";

interface GenderCount {
  male: number;
  female: number;
}

interface AttendanceSummary {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  presentMale: number;
  presentFemale: number;
  absentMale: number;
  absentFemale: number;
  lateMale: number;
  lateFemale: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") || moment().format("YYYY-MM");
  const grade = searchParams.get("grade");
  const section = searchParams.get("section");

  // Set start and end date based on the selected month or current month
  const startDate = moment(month, "YYYY-MM").startOf("month").toDate();
  const endDate = moment(month, "YYYY-MM").endOf("month").toDate();

  // Build the base where clause with date filtering
  let whereClause: any = {
    date: { gte: startDate, lte: endDate },
  };

  // Apply grade and section filters if selected
  if (grade && section) {
    whereClause.student = {
      enrollments: {
        some: { gradeClass: { gradeId: grade, classId: section } },
      },
    };
  } else if (grade) {
    whereClause.student = {
      enrollments: {
        some: { gradeClass: { gradeId: grade } },
      },
    };
  }

  try {
    // Fetch attendance counts grouped by status and gender
    const attendanceCounts = await prisma.attendance.groupBy({
      by: ["status", "studentId", "date"],
      where: whereClause,
      _count: true,
      orderBy: { studentId: "asc" },
    });

    // Fetch student genders separately to avoid Prisma limitations
    const studentGenders = await prisma.student.findMany({
      where: whereClause.student || {},
      select: { id: true, sex: true },
    });

    // Map student IDs to genders
    const genderMap = studentGenders.reduce((acc, { id, sex }) => {
      acc[id] = sex;
      return acc;
    }, {} as Record<string, string>);

    // Count total students
    const totalStudents = studentGenders.length;

    // Initialize attendance summary
    const summary: AttendanceSummary = {
      totalStudents,
      present: 0,
      absent: 0,
      late: 0,
      presentMale: 0,
      presentFemale: 0,
      absentMale: 0,
      absentFemale: 0,
      lateMale: 0,
      lateFemale: 0,
    };

    // Process attendance data for each date
    attendanceCounts.forEach(({ status, studentId, _count, date }) => {
      const gender = genderMap[studentId];

      if (status === "PRESENT") {
        summary.present += _count;
        if (gender === "MALE") summary.presentMale += _count;
        if (gender === "FEMALE") summary.presentFemale += _count;
      }
      if (status === "ABSENT") {
        summary.absent += _count;
        if (gender === "MALE") summary.absentMale += _count;
        if (gender === "FEMALE") summary.absentFemale += _count;
      }
      if (status === "LATE") {
        summary.late += _count;
        if (gender === "MALE") summary.lateMale += _count;
        if (gender === "FEMALE") summary.lateFemale += _count;
      }
    });

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
