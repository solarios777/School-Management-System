import prisma from "@/lib/prisma";

import { currentUser } from "@/lib/auth";

const Announcements = async () => {
  const user= await currentUser()
  const role = user?.role
  const userId = user?.id

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  // const data = await prisma.anno.findMany({
  //   take: 3,
  //   orderBy: { date: "desc" },
  //   where: {
  //     ...(role !== "admin" && {
  //       OR: [
  //         { classId: null },
  //         { class: roleConditions[role as keyof typeof roleConditions] || {} },
  //       ],
  //     }),
  //   },
  // });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {(
          <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium"></h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1"></p>
          </div>
        )}
        { (
          <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium"></h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1"></p>
          </div>
        )}
        { (
          <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium"></h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1"></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
