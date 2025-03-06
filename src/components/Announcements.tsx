import { currentUser } from "@/lib/auth";
import AdminAnnouncements from "./announcement/AdminAnnouncements";
import OtherAnnouncements from "./announcement/OtherAnnouncements";
import Link from "next/link";

const Announcements = async () => {
  const user = await currentUser();
  const role = user?.role.toLocaleLowerCase();

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <Link href="/list/viewAllAnnouncement">view all</Link>
      </div>
      <div className="mt-4">
        {role === "admin" ? <AdminAnnouncements /> : <OtherAnnouncements />}
      </div>
    </div>
  );
};

export default Announcements;