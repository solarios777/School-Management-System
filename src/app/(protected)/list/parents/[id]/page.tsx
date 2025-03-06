import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FormContainer from "@/components/FormContainer";
import { CreateStudentParentRelationshipDialog } from "@/components/StudentParentRelation";
import { RemoveParentRelationshipDialog } from "@/components/removeParentRelation";

const SingleParentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const user = await currentUser();
  const role = user?.role.toLowerCase();

  // Retrieve parent data
  const parent = await prisma.parent.findUnique({
    where: { id },
    include: {
      students: {
        include: {
          student: {
            include: {
              enrollments: {
                include: {
                  gradeClass: {
                    include: {
                      grade: true, // Include grade level
                      class: true, // Include class (section)
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
    return notFound();
  }

  // Extract students with their grade and section
  const students = parent.students.map((sp) => {
    const student = sp.student;
    const enrollment = student.enrollments[0]; // Assuming each student has at least one enrollment
    const gradeClass = enrollment?.gradeClass;
    const grade = gradeClass?.grade || { level: "N/A" }; // Grade level (default to "N/A" if not found)
    const section = gradeClass?.class || { name: "N/A" }; // Class (section) (default to "N/A" if not found)

    return {
      ...student,
      grade,
      section,
    };
  });

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
                src={parent.img || "/noAvatar.png"}
                alt={`${parent.name} ${parent.surname}`}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {parent.name + " " + parent.surname}
                </h1>
                <div className="rounded-md bg-black px-2 py-1 cursor-pointer">
                  {role === "admin" && (
                    <FormContainer table="parent" type="update" data={parent} />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {parent.address || "No address provided."}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="Blood Type" width={14} height={14} />
                  <span>{parent.bloodType || "N/A"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="Birthday" width={14} height={14} />
                  <span>
                    {parent.birthday
                      ? new Intl.DateTimeFormat("en-GB").format(parent.birthday)
                      : "N/A"}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="Email" width={14} height={14} />
                  <span>{parent.email || "N/A"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="Phone" width={14} height={14} />
                  <span>{parent.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-white rounded-md p-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]"
            >
              <div className="flex justify-between items-center">
                {/* You can add additional icons or buttons here if needed */}
              </div>
              <Link href={`/list/students/${student.id}`}>
                <h3 className="text-md md:text-lg lg:text-xl font-semibold my-4">
                  {student.name} {student.surname}
                </h3>
              </Link>
              <h3 className="capitalize text-sm font-medium text-gray-500">
                Grade: {student.grade.level} {student.section.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {role === "admin" && (
          <>
            <CreateStudentParentRelationshipDialog parentId={parent.id} />
            <RemoveParentRelationshipDialog parentId={parent.id} />
          </>
        )}
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleParentPage;