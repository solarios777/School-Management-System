import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import based on your Prisma setup
import { currentUser } from '@/lib/auth';

export async function GET() {
  try {
    // Get the current user
    const user = await currentUser();
    const userId = user?.id;
    const role = user?.role;

    if (!userId || !role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let announcements:any = [];

    if (role === 'TEACHER') {
      // Fetch announcements for teachers
      announcements = await prisma.announcement.findMany({
        orderBy: { date: 'desc' },
        where: {
          OR: [
            { isForWholeSchool: true }, // Announcements for everyone
            { isForTeachers: true }, // Announcements specifically for teachers
          ],
        },
      });
    } else if (role === 'PARENT') {
      // Fetch the parent's children
      const parent = await prisma.parent.findUnique({
        where: { id: userId },
        include: {
          students: {
            include: {
              student: {
                include: {
                  enrollments: {
                    include: {
                      gradeClass: {
                        include: {
                          grade: true,
                          class: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!parent) {
        return NextResponse.json({ error: 'Parent data not found' }, { status: 404 });
      }

      // Get the children's grade and class IDs
      const gradeIds = parent.students.flatMap((studentParent) =>
        studentParent.student.enrollments.map(
          (enrollment) => enrollment.gradeClass.grade.id
        )
      );
      const classIds = parent.students.flatMap((studentParent) =>
        studentParent.student.enrollments.map(
          (enrollment) => enrollment.gradeClass.class.id
        )
      );

      // Fetch announcements for parents
      announcements = await prisma.announcement.findMany({
        orderBy: { date: 'desc' },
        where: {
          OR: [
            { isForWholeSchool: true }, // Announcements for everyone
            { isForParents: true }, // Announcements specifically for parents
            {
              AND: [
                { gradeIds: { hasSome: gradeIds } }, // Announcements for the children's grades
                { classIds: { hasSome: classIds } }, // Announcements for the children's classes
              ],
            },
          ],
        },
      });
    } else if (role === 'STUDENT') {
      // Fetch announcements for students
      const student = await prisma.student.findUnique({
        where: { id: userId },
        include: {
          enrollments: {
            include: {
              gradeClass: {
                include: {
                  grade: true,
                  class: true,
                },
              },
            },
          },
        },
      });

      if (!student) {
        return NextResponse.json({ error: 'Student data not found' }, { status: 404 });
      }

      // Get the student's grade and class IDs
      const gradeIds = student.enrollments.map(
        (enrollment) => enrollment.gradeClass.grade.id
      );
      const classIds = student.enrollments.map(
        (enrollment) => enrollment.gradeClass.class.id
      );

      // Fetch announcements for students
      announcements = await prisma.announcement.findMany({
        orderBy: { date: 'desc' },
        where: {
          OR: [
            { isForWholeSchool: true }, // Announcements for everyone
            {
              AND: [
                { gradeIds: { hasSome: gradeIds } }, // Announcements for the student's grade
                { classIds: { hasSome: classIds } }, // Announcements for the student's class
              ],
            },
          ],
        },
      });
    }

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}