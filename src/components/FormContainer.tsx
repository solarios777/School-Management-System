import prisma from "@/lib/prisma";
import FormModal from "./FormModal";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "assignTeacher"
    | "assignSupervisor"
    | "enroll"
    | "changePassword"
    | "announcement";
  type: "create" | "update" | "delete" | "changePassword" |"enroll";
  data?: any;
  id?: number | string;
  username?: string;
  role?: string;
};

const FormContainer = async ({ table, type, data, id ,username,role}: FormContainerProps) => {

  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "assignSupervisor":
        try {
          const subjectTeacher = await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          });
          const grades=await prisma.grade.findMany()
          const classes=await prisma.class.findMany()
          const Subjects=await prisma.subject.findMany()
          relatedData={
            teachers: subjectTeacher,
            classes:classes,
            subjects:Subjects,
            grades:grades
          }
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
        break;
        case "assignTeacher":
        try {
          const subjectTeacher = await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          });
          const grades=await prisma.grade.findMany()
          const classes=await prisma.class.findMany()
          const Subjects=await prisma.subject.findMany()
          relatedData={
            teachers: subjectTeacher,
            classes:classes,
            subjects:Subjects,
            grades:grades
          }
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
        break;
        case "enroll":
        try {
          
          const classes=await prisma.class.findMany()
          relatedData={
            
            classes:classes,
          }
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
        break;
        case "subject":
        try {
          const subjectTeacher = await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          });
          
          const classes=await prisma.class.findMany()
          const Subjects=await prisma.subject.findMany()
          relatedData={
            teachers: subjectTeacher,
            classes:classes,
            subjects:Subjects
          }
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
        break;
         case "changePassword":
        try {
          const user=username
          const userRole=role
          relatedData={
            username:user,
            role:userRole
            
          }
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} username={username} role={role}/>
    </div>
  );
};

export default FormContainer;