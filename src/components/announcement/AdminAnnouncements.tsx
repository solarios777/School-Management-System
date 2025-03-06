import prisma from "@/lib/prisma";

const AdminAnnouncements = async () => {
  // Fetch the 3 most recent announcements for admin
  const announcements = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-lamaSkyLight rounded-md p-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{announcement.title}</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              {new Date(announcement.date).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {announcement.description.length > 50
              ? `${announcement.description.substring(0, 50)}...`
              : announcement.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminAnnouncements;