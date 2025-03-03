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
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 hidden lg:block">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <span className="hidden lg:block font-bold">MCS</span>
          </Link>
          <Menu />
        </div>
        {/* RIGHT */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
         <Navbar user={user} />
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
