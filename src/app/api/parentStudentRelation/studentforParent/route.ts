
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const field = searchParams.get('field');

  if (!query || query.length < 2 || !field) {
    return NextResponse.json([]);
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        [field]: { contains: query, mode: 'insensitive' },
      },
      take: 10, // Limit the number of results
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}