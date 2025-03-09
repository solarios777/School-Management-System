import AGgrid from "@/components/AGgrid";
import FormModal from "@/components/FormModal";
import TableSearch from "@/components/TableSearch";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { Prisma } from "@prisma/client";

type ParentList = {
  id: string;
  name: string;
  email?: string;
  username: string;
  phone?: string;
  address: string;
  img?: string;
  firstpass?: any;
  action?: JSX.Element;
};

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  const role = user?.role.toLowerCase();

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Username", accessor: "username" },
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
    { header: "First Pass", accessor: "firstpass" },
  ];

  const { search } = searchParams;

  const query: Prisma.ParentWhereInput = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      
    }),
    prisma.parent.count({ where: query }),
  ]);

  // Transform data to match AG Grid
  const formattedData: ParentList[] = data.map((parent) => ({
    id: parent.id,
    name: parent.name,
    email: parent.email || "N/A",
    username: parent.username,
    phone: parent.phone || "N/A",
    address: parent.address || "N/A",
    img: parent.img || "/noAvatar.png",
    firstpass: parent.firstpass,
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
         
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="parent" type="create" />}
          </div>
        </div>
      </div>
      <AGgrid columns={columns} data={formattedData} list="parents" />
    </div>
  );
};

export default ParentListPage;
