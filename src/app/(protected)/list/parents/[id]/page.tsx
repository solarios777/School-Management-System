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

  // Retrieve student data
  const parent = await prisma.parent.findUnique({
    where: { id },
    
  });

  if (!parent) {
    return notFound();
  }

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
                <div className="rounded-md bg-black px-2 py-1 cursor-pointer" >
                {role === "admin" && (
                  <FormContainer  table="parent" type="update" data={parent}/>
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
                      ? new Intl.DateTimeFormat("en-GB").format(
                          parent.birthday
                        )
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

          {/* SMALL CARDS */}
          
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
  {/* Grade Card */}
  <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
    <Image
      src="/singleClass.png" // Update the icon if necessary
      alt="Student Grade"
      width={24}
      height={24}
      className="w-6 h-6"
    />
    <div>
      <h1 className="text-xl font-semibold">
        {/* {parent.enrollments[0]?.gradeClass?.grade?.level || "N/A"} */}
      </h1>
      <span className="text-sm text-gray-400">Grade</span>
    </div>
  </div>

  {/* Class Card */}
  <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
    <Image
      src="/singleClass.png" // Update the icon if necessary
      alt="Student Class"
      width={24}
      height={24}
      className="w-6 h-6"
    />
    <div>
      <h1 className="text-xl font-semibold">
        {/* {student.enrollments[0]?.gradeClass?.class?.name || "N/A"} */}
      </h1>
      <span className="text-sm text-gray-400">Section</span>
    </div>
  </div>
</div>

        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          {/* Schedule could go here */}
          {/* <BigCalendar type="studentId" id={student.id} /> */}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/classes?studentId=${parent.id}`}
            >
              Student&apos;s Classes
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/assignments?studentId=${parent.id}`}
            >
              Student&apos;s Assignments
            </Link>
          </div>
        </div>

        {/* Add the Create Relationship Dialog */}
        <CreateStudentParentRelationshipDialog parentId={parent.id} />

      <RemoveParentRelationshipDialog parentId={parent.id} />
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleParentPage;