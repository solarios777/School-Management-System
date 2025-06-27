import Announcements from "@/components/Announcements";
// import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import TeacherScheduleTable from "@/components/tasks/TeacherScheduleTable";
import TeacherClassesDialog from "@/components/TeacherClassesDialog";

const SingleTeacherPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const user = await currentUser();
  const role = user?.role.toLowerCase();

 const teacher = await prisma.teacher.findUnique({
  where: { id },
  include: {
    assignments: {
      include: {
        gradeClass: { include: { class: true, grade: true } },
        subject: true, // Include the subject details
      },
    },
    superviser: {
      include: { gradeClass: { include: { class: true, grade: true } } },
    },
    _count: {
      select: {
        assignments: true,
        superviser: true,
      },
    },
  },
});

  if (!teacher) {
    return notFound();
  }

  // Extract unique subjects taught by the teacher
  const subjects = Array.from(new Set(teacher.assignments.map(assignment => assignment.subject.name)));

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={teacher.img || "/noAvatar.png"}
                alt={`${teacher.name} ${teacher.surname}`}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {teacher.name + " " + teacher.surname}
                </h1>
                <div className="rounded-md bg-black px-2 py-1 cursor-pointer">
                  {role === "admin" && (
                    <FormContainer
                      table="teacher"
                      type="update"
                      data={teacher}
                    />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {teacher.address || "No address provided."}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image
                    src="/blood.png"
                    alt="Blood Type"
                    width={14}
                    height={14}
                  />
                  <span>{teacher.bloodType || "N/A"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image
                    src="/date.png"
                    alt="Birthday"
                    width={14}
                    height={14}
                  />
                  <span>
                    {teacher.birthday
                      ? new Intl.DateTimeFormat("en-GB").format(
                          teacher.birthday
                        )
                      : "N/A"}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="Email" width={14} height={14} />
                  <span>{teacher.email || "N/A"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="Phone" width={14} height={14} />
                  <span>{teacher.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt="Attendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt="Subjects"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.assignments}
                </h1>
                <span className="text-sm text-gray-400">Assignments</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex flex-col gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt="Supervision"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">Supervisions</h1>
                <div className="text-sm text-gray-500">
                  {teacher.superviser.length > 0 ? (
                    teacher.superviser.map((supervision) => (
                      <Link
                        key={supervision.id}
                        href={`/list/classes/${supervision.gradeClass.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <span className="text-black">
                          {supervision.gradeClass.grade.level}{" "}
                          {supervision.gradeClass.class.name}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <span>No supervisions assigned</span>
                  )}
                </div>
              </div>
            </div>
            {/* New Small Card for Teacher's Subjects */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/subject.png"
                alt="Subjects"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-bold">
                <div className="text-sm text-gray-500">
                  {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                      <span key={index} className="block">
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span>No subjects assigned</span>
                  )}
                </div>
                </h1>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <TeacherScheduleTable teacherId={teacher.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <TeacherClassesDialog assignments={teacher.assignments} />
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;