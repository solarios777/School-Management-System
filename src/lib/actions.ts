import prisma from "@/lib/prisma";

export const getTeachers = async () => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        assignments: {
          include: {
            subject: true,
            class: true,
            grade: true,
          },
        },
      },
    });
    return { data: teachers };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const getGrades = async () => {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        enrollments: true,
        assignments: true,
        subjectClassGrades: true,
      },
    });
    return { data: grades };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const getSubjects = async () => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        assignments: true,
        subjectClassGrades: true,
      },
    });
    return { data: subjects };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const getClasses = async () => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        events: true,
        announcements: true,
        enrollments: true,
        assignments: {
          include: {
            teacher: true,
            subject: true,
            grade: true,
          },
        },
        subjectClassGrades: true,
      },
    });
    return { data: classes };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

