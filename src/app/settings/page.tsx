import prisma from "@/lib/prisma";
import FormModal from "../../components/FormModal";

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
  //   switch (table) {
  //     case "subject":
        try {
          const subjectTeacher = await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          });
          relatedData = {
            teachers: subjectTeacher.map((teacher) => ({
              ...teacher,
              id: String(teacher.id), // Ensure serialization
            })),
          };
        } catch (error) {
          console.error("Error fetching teachers:", error);
        }
  //       break;

  //     default:
  //       break;
  //   }
  }

          console.log(relatedData);
          
  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
      <>{relatedData.teachers?.map((teacher: any) => <>{teacher.name}</>)}</>
    </div>
  );
};
export default FormContainer;