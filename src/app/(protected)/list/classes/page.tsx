import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
// import { ITEMS_PER_PAGE } from "@/lib/settings";

import { Class, Grade, GradeClass, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";
import { currentUser } from "@/lib/auth";
import FormContainer from "@/components/FormContainer";

type ClassList= Grade & {
  
  gradeClass: GradeClass & {
      grade: Grade;   // Include Grade relation
      class: Class;   // Include Class relation
    };
  
}



const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  const role = user?.role.toLowerCase();
  const currentUserId = user?.id;

  const ITEMS_PER_PAGE = 12;
  const columns = [
    {
      header: "Grade",
      accessor: "level",
      className: "hidden md:table-cell",
    },
    
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ClassList & { GradeClass: { class: Class }[] }) => (
    <>
      <tr className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">{item.level}</td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormContainer table="class" type="update" data={item} />
                <FormContainer table="class" type="delete" id={item.id} />
              </>
            )}
          </div>
        </td>
      </tr>
      {item.GradeClass.length > 0 && (
        <tr>
          <td colSpan={columns.length} className="p-4">
            <div className="pl-8">
              <h3 className="font-semibold">Sections:</h3>
              <ul>
                {item.GradeClass.map((gc) => (
                  <li key={gc.class.id}>{gc.class.name}</li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.GradeWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value.trim() !== "") {
        switch (key) {
          case "search":
            query.level = { equals: Number(value) };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.grade.findMany({
      where: query,
      include: {
        GradeClass: {
          include: {
            class: true, // Include class details
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.grade.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="class" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ClassListPage;