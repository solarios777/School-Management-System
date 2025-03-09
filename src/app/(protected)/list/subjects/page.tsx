
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Class, Grade, GradeClass, Prisma, Subject, Teacher, TeacherAssignment } from "@prisma/client";
import Image from "next/image";
import { currentUser } from "@/lib/auth";
import FormContainer  from "@/components/FormContainer";

type SubjectList = Subject & {
  assignments: (TeacherAssignment & {
    teacher: Teacher; 
    gradeClass: GradeClass & {
      grade: Grade;   // Include Grade relation
      class: Class;   // Include Class relation
    };
    
  })[];
}

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  const role = user?.role.toLowerCase();
  const currentUserId = user?.id;

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Teachers",
      accessor: "teachers",
      className: "hidden md:table-cell",
    },
    //  {
    //   header: "classes",
    //   accessor: "classes",
    //   className: "hidden md:table-cell",
    // },
    {
      header: "Actions",
      accessor: "action",
    },
  ];
 
  
  const renderRow = (item: SubjectList) => {
    const teachers = item.assignments.map(assignment => assignment.teacher.name).join(", ");
    // const classes = item.assignments.map(assignment => assignment.class.name).join(", ");
    // const grades= item.assignments.map(assignment => assignment.grade.name).join(", ");

    const numberOfTeachers = teachers ? teachers.split(", ").length : 0;


    return (
      <tr 
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">{item.name}</td>
        <td className="hidden md:table-cell">{numberOfTeachers|| "No teachers assigned"}</td>
        {/* <td className="hidden md:table-cell">{teachers|| "No teachers assigned"}</td> */}

        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && ( 
              <>
                <FormContainer table="subject" type="update" data={item} />
                <FormContainer table="subject" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };
  
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  
  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        assignments: {
          include: {
            teacher: true,
             gradeClass: {
              include: {
                grade: true, // Include Grade
                class: true, // Include Class
              },},
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
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
            {role === "admin" && <FormContainer table="subject" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
      
    </div>
  );
};

export default SubjectListPage;