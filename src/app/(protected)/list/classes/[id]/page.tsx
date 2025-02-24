import AGgrid from "@/components/AGgrid";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleClassPage = async ({ params }: { params: { id: string } }) => {
  // console.log("params",params.id);

  const classId = params.id;

  // Fetch class details
  const gradeClass = await prisma.gradeClass.findUnique({
    where: { id: classId },
    include: {
      grade: true,
      class: true,
      enrollments: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!gradeClass) return notFound();

  // Extract class details
  const { grade, class: section, enrollments } = gradeClass;
  const studentCount = enrollments.length;

  // Prepare student data for AG Grid
  const students = enrollments.map((enrollment) => ({
    id: enrollment.student.id,
    name: `${enrollment.student.name} ${enrollment.student.surname}`,
    username: enrollment.student.username,
    sex: enrollment.student.sex,
    phone: enrollment.student.phone || "N/A",
    address: enrollment.student.address,
  }));

  const studentColumns = [
    { header: "Name", accessor: "name" },
    { header: "Username", accessor: "username" },
    { header: "Sex", accessor: "sex" },
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
  ];

  return (
    <div className="bg-white p-4 rounded-md m-4">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-lg font-semibold">
          Grade {grade.level} {section.name}
        </h1>
        <h1 className="text-lg font-semibold">{studentCount} Students</h1>
      </div>
      <div className="mb-4 gap-2 bg-gray-100 flex">
        <Link
        className="px-4 py-2 bg-black text-white rounded-md "
          href={{
            pathname: `/list/attendance/${classId}`,
            query: {
              gradeId: grade.id,
              classId: section.id,
            },
          }}
        >
          Attendance
        </Link>
        <Link
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md "
          href={{
            pathname: `/list/viewResults/${classId}`,
            query: {
              gradeId: grade.id,
              classId: section.id,
            },
          }}
        >
          Results
        </Link>
      </div>
      <div></div>
      <AGgrid columns={studentColumns} data={students} list="students" />
    </div>
  );
};

export default SingleClassPage;
