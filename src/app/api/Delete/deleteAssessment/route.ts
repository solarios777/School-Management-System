import { NextApiRequest, NextApiResponse } from "next";
import  prisma  from "@/lib/prisma"; // Ensure correct Prisma path

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { assessmentId, source } = req.body;

    if (!assessmentId || !source) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    if (source === "api") {
      // Delete assessment and related marks
      await prisma.result.deleteMany({
        where: { examType: assessmentId },
      });

      return res.status(200).json({ message: "Assessment deleted from API" });
    }

    if (source === "uploaded") {
      // Handle deletion from extracted file
      return res.status(200).json({ message: "Assessment removed from file" });
    }

    if (source === "new") {
      // Simply remove from state
      return res.status(200).json({ message: "New assessment deleted" });
    }

    return res.status(400).json({ message: "Invalid source type" });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
