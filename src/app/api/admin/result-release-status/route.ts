import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const year = url.searchParams.get("year");
    const semester = Number(url.searchParams.get("semester"));

    if (!year || isNaN(semester)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }
 const nearestDeadline = await prisma.resultRelease.findFirst({
      where: { deadline: { gte: new Date() } }, // Get only future deadlines
      orderBy: { deadline: "asc" }, // Order by closest deadline first
    });
    // Fetch the most recent release status
    const releaseStatus = await prisma.resultRelease.findFirst({
      where: { year, semester },
      orderBy: { createdAt: "desc" },
      select: { isReleased: true },
    });

    return NextResponse.json({ isReleased: releaseStatus?.isReleased ?? false });
  } catch (error) {
    console.error("Error checking release status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
