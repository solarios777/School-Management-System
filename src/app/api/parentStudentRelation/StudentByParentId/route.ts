// app/api/students-by-parent/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    // Validate input
    if (!parentId) {
      return NextResponse.json(
        { error: 'Parent ID is required' },
        { status: 400 }
      );
    }

    // Fetch students by parent ID using the join table
    const students = await prisma.studentParent.findMany({
      where: { parentId },
      include: { student: true },
    });

    return NextResponse.json(students.map((sp) => sp.student));
  } catch (error) {
    console.error('Error fetching students by parent ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students by parent ID' },
      { status: 500 }
    );
  }
}