import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import moment from "moment";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const grade = searchParams.get("grade");
  const section = searchParams.get("section");

  // Fetch data for the last 7 days
  const startDate = moment().subtract(6, "days").startOf("day").toDate();
  const endDate = moment().endOf("day").toDate();

  let whereClause: any = {
    date: { gte: startDate, lte: endDate },
  };

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
    const attendanceCounts = await prisma.attendance.groupBy({
      by: ["status", "date"],
      where: whereClause,
      _count: true,
      orderBy: { date: "asc" },
    });

    // Format data for bar chart
    const formattedData = Array.from({ length: 7 }, (_, i) => {
      const date = moment().subtract(i, "days").format("DD");
      return {
        name: date,
        present: 0,
        absent: 0,
        late: 0,
      };
    }).reverse();

    attendanceCounts.forEach(({ status, date, _count }) => {
      const day = moment(date).format("DD");
      const entry = formattedData.find((d) => d.name === day);

      if (entry) {
        if (status === "PRESENT") entry.present += _count;
        if (status === "ABSENT") entry.absent += _count;
        if (status === "LATE") entry.late += _count;
      }
    });

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
