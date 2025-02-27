import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import ChangePassword from "@/components/password/normalPasswordChange";

const UserPage = async () => {
  const user = await currentUser();
  const userId = user?.id;
  const role = user?.role.toUpperCase();

  if (!userId) {
    return redirect("/login"); // Redirect to login if not authenticated
  }

  let userData = null;
  

  // Fetch user data based on their role
  switch (role) {
    case "STUDENT":
      userData = await prisma.student.findUnique({
        where: { id: userId }
      });
      
      break;

    case "TEACHER":
      userData = await prisma.teacher.findUnique({
        where: { id: userId },
      });
      
      break;

    case "PARENT":
      userData = await prisma.parent.findUnique({
        where: { id: userId },
      });
      break;

    case "ADMIN":
      userData = await prisma.admin.findUnique({
        where: { id: userId },
      });
      break;

    default:
      return redirect("/auth/login"); // If role is unknown, redirect
  }

  if (!userData) {
    return redirect("/auth/login"); // If user data is not found, redirect
  }

  return (
    <ChangePassword firstLogin={userData.firstLogin} role={role}/>
  )
};

export default UserPage;
