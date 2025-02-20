import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { useSession } from "next-auth/react";
import { currentUser } from '@/lib/auth';


export async function GET() {
  const user = await currentUser();
    const role = user?.role;
    const userId = user?.id;

  // Check if the user is an admin
  const isAdmin = await prisma.admin.findUnique({
    where: {
      id: userId,
    },
  });

  // If the user is an admin, return all grades, sections, and subjects
  if (isAdmin) {
    const grades = await prisma.grade.findMany({
      select: { id: true, level: true },
    });
    const sections = await prisma.class.findMany({
      select: { id: true, name: true },
    });
    const subjects = await prisma.subject.findMany({
      select: { id: true, name: true },
    });

    return NextResponse.json({ grades, sections, subjects });
  }

  // If the user is a teacher, return only their assigned grades, sections, and subjects
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: userId,
    },
    include: {
      assignments: {
        include: {
          gradeClass: {
            include: {
              grade: true,
              class: true,
            },
          },
          subject: true,
        },
      },
    },
  });

  if (!teacher) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Extract unique assigned grades
const assignedGrades = Array.from(
  new Map(
    teacher.assignments.map((a) => [a.gradeClass.grade.id, { id: a.gradeClass.grade.id, level: a.gradeClass.grade.level }])
  ).values()
);

// Extract unique assigned sections
const assignedSections = Array.from(
  new Map(
    teacher.assignments.map((a) => [a.gradeClass.class.id, { id: a.gradeClass.class.id, name: a.gradeClass.class.name }])
  ).values()
);

// Extract unique assigned subjects
const assignedSubjects = Array.from(
  new Map(
    teacher.assignments.map((a) => [a.subject.id, { id: a.subject.id, name: a.subject.name }])
  ).values()
);

  return NextResponse.json({ grades: assignedGrades, sections: assignedSections, subjects: assignedSubjects });
}
