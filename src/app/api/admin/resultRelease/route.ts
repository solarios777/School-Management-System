import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

// ✅ GET method to fetch deadline by year & semester
// export async function GET(req: NextRequest) {
//   try {
//     const user = await currentUser();
//     const role = user?.role?.toUpperCase();

//     if (!user || role !== "ADMIN") {
//       return NextResponse.json({ message: "Forbidden: Only admins can set deadlines" }, { status: 403 });
//     }

//     const { searchParams } = new URL(req.url);
//     const year = searchParams.get("year");
//     const semester = searchParams.get("semester");

//     if (!year || !semester) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     const resultRelease = await prisma.resultRelease.findFirst({
//       where: {
//         year: year as string,
//         semester: Number(semester),
//       },
//     });

//     return NextResponse.json(resultRelease, { status: 200 });
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    const role = user?.role?.toUpperCase();

    if (!user || role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden: Only admins can set deadlines" }, { status: 403 });
    }

    const nearestDeadline = await prisma.resultRelease.findFirst({
      where: { deadline: { gte: new Date() } }, // Get only future deadlines
      orderBy: { deadline: "asc" }, // Order by closest deadline first
    });

    return NextResponse.json(nearestDeadline, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}


// ✅ POST method to create/update deadline
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const role = user?.role?.toUpperCase();

    if (!user || role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden: Only admins can set deadlines" }, { status: 403 });
    }

    const body = await req.json();
    const { year, semester, deadline } = body;

    if (!year || !semester || !deadline) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      return NextResponse.json({ message: "Invalid deadline format" }, { status: 400 });
    }

    const existingRecord = await prisma.resultRelease.findFirst({
      where: {
        year: year as string,
        semester: Number(semester),
      },
    });

    let resultRelease;
    if (existingRecord) {
      // Update existing record
      resultRelease = await prisma.resultRelease.update({
        where: { id: existingRecord.id },
        data: { deadline: parsedDeadline, isReleased: false },
      });
    } else {
      // Create new record
      resultRelease = await prisma.resultRelease.create({
        data: { year, semester, deadline: parsedDeadline, isReleased: false },
      });
    }

    return NextResponse.json({ message: "Deadline set successfully", resultRelease }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
