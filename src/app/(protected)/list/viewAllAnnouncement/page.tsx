import AnnouncementList from "@/components/announcement/AnnouncementList";
import MainAnnounce from "@/components/announcement/mainAnnounce";
import ViewAll from "@/components/announcement/viewAll";
// import NonAdminComponent from "@/components/announcement/NonAdminComponent"; // Import your non-admin component
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

const viewAllAnnouncement = async () => {
  const user = await currentUser();
  const userId = user?.id;
  const role = user?.role;

  // Fetch grades and classes
  const grades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  const classes = await prisma.class.findMany({
    select: { id: true, name: true },
  });

  return (
    <div>
      {/* Conditionally render components based on user role */}
      {role === "ADMIN" ? (
        <>
          <MainAnnounce grades={grades} classes={classes} />
          <AnnouncementList grades={grades} classes={classes} />
        </>
      ) : (
        <ViewAll/>// Render the non-admin component
      )}
    </div>
  );
};

export default viewAllAnnouncement;