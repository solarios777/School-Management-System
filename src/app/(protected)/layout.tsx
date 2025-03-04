import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../../auth";
import { currentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
   const user = await currentUser();
 return (
    <SessionProvider session={session}>
      <div className="h-screen flex">
        {/* LEFT */}
        <div className="w-[0%] md:w-[8%] lg:w-[12%] xl:w-[12%] p-4 hidden lg:block">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <span className="hidden lg:block font-bold">MCS</span>
          </Link>
          <Menu />
        </div>
        {/* RIGHT */}
        <div className="w-[100%] md:w-[92%] lg:w-[88%] xl:w-[88%] bg-[#F7F8FA] overflow-scroll flex flex-col">
         <Navbar user={user} />
         <div className='mt-16'>{children}</div>
          
        </div>
      </div>
    </SessionProvider>
  );
}
