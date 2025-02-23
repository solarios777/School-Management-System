import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function PATCH(req: NextRequest) {
  try {
    const { year, semester } = await req.json();

    if (!year || !semester) {
      return NextResponse.json({ message: "Year and semester are required." }, { status: 400 });
    }

    const resultRelease = await prisma.resultRelease.updateMany({
      where: { year, semester },
      data: { isReleased: true },
    });

    if (resultRelease.count === 0) {
      return NextResponse.json({ message: "No matching records found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Results released successfully." });
  } catch (error) {
    console.error("Error releasing results:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
