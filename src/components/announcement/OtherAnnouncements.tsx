import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

const OtherAnnouncements = async () => {
  const user = await currentUser();
  const userId = user?.id;
  const role = user?.role;

  if (!userId || !role) {
    throw new Error("User not authenticated or role not defined.");
  }

  // Fetch announcements based on the user's role
  let announcements: any = [];

  if (role === "TEACHER") {
    // Fetch announcements for teachers
    announcements = await prisma.announcement.findMany({
      take: 3,
      orderBy: { date: "desc" },
      where: {
        OR: [
          { isForWholeSchool: true }, // Announcements for everyone
          { isForTeachers: true }, // Announcements specifically for teachers
        ],
      },
    });
  } else if (role === "PARENT") {
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
      throw new Error("Parent data not found.");
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
      take: 3,
      orderBy: { date: "desc" },
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
  } else if (role === "STUDENT") {
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
      throw new Error("Student data not found.");
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
      take: 3,
      orderBy: { date: "desc" },
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

  return (
    <div className="flex flex-col gap-4">
      {announcements.map((announcement: any) => (
        <div
          key={announcement.id}
          className="bg-lamaPurpleLight rounded-md p-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{announcement.title}</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              {new Date(announcement.date).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {announcement.description.length > 30
              ? `${announcement.description.substring(0, 30)}...`
              : announcement.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OtherAnnouncements;