import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Adjust path to your Prisma instance

// Fetch Results based on Grade, Section, and Exam Type
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { gradeId, sectionId, examType } = req.query;

    try {
      const results = await prisma.result.findMany({
        where: {
          student: {
            enrollments: {
              some: {
                gradeClass: {
                  gradeId: gradeId as string,
                  classId: sectionId as string,
                },
              },
            },
          },
          examType: examType as string,
        },
        include: {
          student: true,
          subject: true,
        },
      });

      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching results:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
