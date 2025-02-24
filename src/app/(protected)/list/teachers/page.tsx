import AGgrid from "@/components/AGgrid";
import FormModal from "@/components/FormModal";
import TableSearch from "@/components/TableSearch";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import FormContainer from "@/components/FormContainer";

type TeacherList = {
  id: string;
  name: string;
  username: string;
  phone?: string;
  address: string;
  img?: string;
  grade?: string;
  class?: string;
};

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  const role = user?.role.toLowerCase();

  // Define columns for AGgrid
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Username", accessor: "username" },
    { header: "Grade", accessor: "grade" },
    { header: "Class", accessor: "class" },
    { header: "Subject", accessor: "subject" }, // New Subject Column
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
  ];

  // Extract search query
  const { search } = searchParams;

  // Build Prisma query based on search params
  const query: Prisma.TeacherWhereInput = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  // Fetch teacher data and count
  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        assignments: {
          include: {
            gradeClass: { include: { grade: true, class: true } },
            subject: true, // Include subject relation
          },
        },
      },
    }),
    prisma.teacher.count({ where: query }),
  ]);

  // Transform data for AGgrid
  const formattedData: TeacherList[] = data.map((teacher) => ({
    id: teacher.id,
    name: teacher.name,
    username: teacher.username,
    phone: teacher.phone || "N/A",
    address: teacher.address,
    img: teacher.img || "/noAvatar.png",
    grade: teacher.assignments[0]?.gradeClass?.grade?.level?.toString() || "N/A",
    class: teacher.assignments[0]?.gradeClass?.class?.name || "N/A",
    subject: teacher.assignments[0]?.subject?.name || "N/A", // Extract subject name
   
  }));
  

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="assignTeacher" type="enroll" />}
            {role === "admin" && <FormContainer table="teacher" type="create" />}
          </div>
        </div>
      </div>
      {/* Render AGgrid with teacher data */}
      <AGgrid columns={columns} data={formattedData} list="teachers" />
    </div>
  );
};

export default TeacherListPage;
