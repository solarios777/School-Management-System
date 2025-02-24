import AGgrid from "@/components/AGgrid";
import TableSearch from "@/components/TableSearch";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import FormContainer from "@/components/FormContainer";

type StudentList = {
  id: string;
  sex: string;
  name: string;
  username: string;
  phone?: string;
  address: string;
  img?: string;
  grade?: string;
  class?: string;
};

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  const role = user?.role.toLowerCase();

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Username", accessor: "username" },
    { header: "Sex", accessor: "sex" },
    { header: "Grade", accessor: "grade" },
    { header: "Class", accessor: "class" },
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const { search } = searchParams;
  
  const query: Prisma.StudentWhereInput = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        enrollments: {
          include: { gradeClass: { include: { grade: true, class: true } } },
        },
      },
    }),
    prisma.student.count({ where: query }),
  ]);

  // Transform data to match AG Grid
  const formattedData: StudentList[] = data.map((student) => ({
  id: student.id,
  name: `${student.name} ${student.surname}`,
  username: student.username,
  sex: student.sex,
  phone: student.phone || "N/A",
  address: student.address,
  img: student.img || "/noAvatar.png",
  grade: student.enrollments[0]?.gradeClass?.grade?.level?.toString() || "N/A",
  class: student.enrollments[0]?.gradeClass?.class?.name || "N/A",
  action: role === "admin" ? <FormContainer table="student" type="delete" id={student.id} /> : null,
}));


  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="student" type="create" />
            )}
          </div>
        </div>
      </div>
      <AGgrid columns={columns} data={formattedData} list="students" />
      

    </div>
  );
};

export default StudentListPage;
