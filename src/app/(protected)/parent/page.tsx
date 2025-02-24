import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

const StudentPage = async () => {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    return redirect("/login"); // Redirect to login if user is not authenticated
  }

  const parent= await prisma.parent.findUnique({
    where: { id: userId },
    include: { students: true },
  });

  if (!parent) {
    return redirect("/not-found"); // Redirect to a not found page if student is not found
  }

  return redirect(`list/parents/${userId}`); // Redirect to SingleStudentPage
};

export default StudentPage;
