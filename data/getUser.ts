import prisma from "@/lib/prisma";



export const getUserById = async (id: string) => {
    try {
        // Check in Admin table
        let user = await prisma.admin.findUnique({
            where: { id }
        });
        if (user) return user;

        // Check in Teacher table
        user = await prisma.teacher.findUnique({
            where: { id }
        });
        if (user) return user;

        // Check in Student table
        user = await prisma.student.findUnique({
            where: { id }
        });
        if (user) return user;

        // Check in Parent table
        user = await prisma.parent.findUnique({
            where: { id }
        });
        if (user) return user;

        return null; // User not found in any table
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};


 
   export const getUserByAdminname= async (name: string) => {
    try {
      const user = await prisma.admin.findUnique({
          where: {username:name }
      });
      return user
    } catch  {
      return null
    }
  }
  export const getUserByStudentname= async (name: string) => {
    try {
      const user = await prisma.student.findUnique({
          where: {  username:name  },
      });
      return user
    } catch  {
      return null
    }
  }
  export const getUserByTeachername= async (name: string) => {
    try {
      const user = await prisma.teacher.findUnique({
          where: {  username:name  },
      });
      return user
    } catch  {
      return null
    }
  }
  export const getUserByParentname= async (name: string) => {
    try {
      const user = await prisma.parent.findUnique({
          where: {  username:name },
      });
      return user
    } catch  {
      return null
    }
  }