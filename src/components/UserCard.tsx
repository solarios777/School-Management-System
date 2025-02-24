import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const UserCard = async ({
  type,path
}: {
  type: "admin" | "teacher" | "student" | "parent";
  path:string
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        
      </div>
      <Link href={path}><h1 className="text-2xl font-semibold my-4">{data}</h1></Link>
      
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;
