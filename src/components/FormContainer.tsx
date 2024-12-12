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
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {

  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
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

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    </div>
  );
};

export default FormContainer;