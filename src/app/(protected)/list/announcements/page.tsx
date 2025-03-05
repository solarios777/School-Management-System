
import AnnouncementList from "@/components/announcement/AnnouncementList";
import MainAnnounce from "@/components/announcement/mainAnnounce";
import prisma from "@/lib/prisma";

const AttendancePage = async () => {
  const grades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  const classes = await prisma.class.findMany({
    select: { id: true, name: true },
  });
 
  return (
    <div>
        <MainAnnounce grades={grades} classes={classes} />
      <AnnouncementList grades={grades} classes={classes} />
    </div>
  )}

export default AttendancePage