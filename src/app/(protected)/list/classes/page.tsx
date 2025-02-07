import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { Class, Grade, GradeClass, Prisma } from "@prisma/client";
import Image from "next/image";
import { currentUser } from "@/lib/auth";
import FormContainer from "@/components/FormContainer";

type ClassList = Grade & {
  GradeClass: (GradeClass & {
    class: Class;
    _count: {
      enrollments: number; // Count of students
    };
    superviser: {
      teacher: {
        name: string;
        surname: string;
      };
    }[];
  })[];
};

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  const role = user?.role.toLowerCase();

  const ITEMS_PER_PAGE = 12;
  const columns = [
    {
      header: "Grade",
      accessor: "level",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: ClassList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">
        <details>
          <summary className="cursor-pointer">
            {item.level}
            <span className="ml-2 text-sm text-gray-500">
              {item.GradeClass.filter((gc) => gc._count.enrollments > 0).length > 0
                ? `(${item.GradeClass.filter((gc) => gc._count.enrollments > 0).length} sections)`
                : "(No sections)"}
            </span>
          </summary>
          {item.GradeClass.filter((gc) => gc._count.enrollments > 0).length > 0 && (
            <div className="mt-2 pl-4">
              <table className="w-full text-sm text-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Section</th>
                    <th className="px-4 py-2 text-left hidden md:table-cell">Number of Students</th>
                    <th className="px-4 py-2 text-left">Supervisor</th>
                    {role === "admin" && <th className="px-4 py-2 text-left">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {item.GradeClass.sort((a, b) =>
                    a.class.name.localeCompare(b.class.name)
                  ).map((gc) => (
                    <tr key={gc.class.id}>
                      <td className="px-4 py-2">{gc.class.name}</td>
                      <td className="px-4 py-2 hidden md:table-cell">
                        {gc._count.enrollments}
                      </td>
                      <td className="px-4 py-2">
                        {gc.superviser.length > 0
                          ? gc.superviser
                              .map(
                                (sup) =>
                                  `${sup.teacher.name} ${sup.teacher.surname}`
                              )
                              .join(", ")
                          : "No Supervisor"}
                      </td>
                      {role === "admin" && (
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <FormContainer
                              table="assignSupervisor"
                              type="update"
                              data={gc}
                            />
                            <FormContainer
                              table="assignSupervisor"
                              type="create"
                              data={{ gc, item }}
                            />
                            <FormContainer
                              table="assignSupervisor"
                              type="delete"
                              id={gc.class.id}
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </details>
      </td>
    </tr>
  );

  const { page, teacherId, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.GradeWhereInput = {};

  // Add filtering logic for teacherId
  if (teacherId) {
    query.GradeClass = {
      some: {
        OR: [
          { superviser: { some: { teacherId: teacherId } } }, // Classes the teacher supervises
          { assignments: { some: { teacherId: teacherId } } }, // Classes the teacher teaches
        ],
      },
    };
  }

  // Handle search filters
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
            class: true,
            superviser: {
              include: {
                teacher: {
                  select: {
                    name: true,
                    surname: true,
                  },
                },
              },
            },
            _count: {
              select: {
                enrollments: true,
              },
            },
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
        <h1 className="hidden md:block text-lg font-semibold">Classes</h1>
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
