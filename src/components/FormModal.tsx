"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { deleteSubject } from "../../actions/subjectRegister";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FormContainerProps } from "./FormContainer";
import { deleteSection } from "../../actions/classRegister ";

type TableKey = keyof typeof deleteActionMap;
interface FormModalProps extends FormContainerProps {
  relatedData?: any;
  table: TableKey; // Ensure table is one of the valid keys
}


const deleteActionMap = {
  subject: deleteSubject,
  assignTeacher: deleteSubject,
  class: deleteSection,
  teacher: deleteSubject,
  student: deleteSubject,
  exam: deleteSubject,
// TODO: OTHER DELETE ACTIONS
  parent: deleteSubject,
  lesson: deleteSubject,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteSubject,
  assignSupervisor: deleteSubject,
  changePassword: deleteSubject,
  enroll: deleteSubject
  
  
};


// USE LAZY LOADING

// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";


const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignTeacherForm = dynamic(() => import("./forms/AssignTeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const  ClassForm= dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SuperviserForm = dynamic(() => import("./forms/SuperviserForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EnrollStudentForm = dynamic(() => import("./forms/EnrollStudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ChangePasswordForm = dynamic(() => import("./forms/changePasswordForm"), {
  loading: () => <h1>Loading...</h1>,
});
const forms: {
  [key: string]: (setOpen: Dispatch<SetStateAction<boolean>>, type: "create" | "update"|"changePassword" | "enroll" , data?: any,relatedData?:any, username?:string,role?:string) => JSX.Element;
} = {
  teacher: (setOpen,type, data,relatedData) => <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  student: (setOpen,type, data,relatedData) => <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  parent: (setOpen,type, data,relatedData) => <ParentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  subject: (setOpen,type, data,relatedData) => <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  assignTeacher: (setOpen,type,data,relatedData) => <AssignTeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  enroll: (setOpen,type,data,relatedData) => <EnrollStudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  assignSupervisor: (setOpen,type,data,relatedData) => <SuperviserForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  class: (setOpen,type,data,relatedData) => <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
  changePassword: (setOpen,type,data,relatedData) => <ChangePasswordForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,

};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
  
}: FormContainerProps & {relatedData?:any}) => {
  const size = type === "create" || type === "enroll" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create" || type === "enroll"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamared";

  const [open, setOpen] = useState(false);

 const Form = () => {
  const router = useRouter();
  
  // Only use formAction for delete operations
  const [state, formAction] = useFormState(
    type === "delete" ? deleteActionMap[table] : async () => ({ 
      success: false, 
      error: false, 
      message: "" 
    }),
    { success: false, error: false, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state]);

  if (type === "delete" && id) {
    if (table === "changePassword" || table === "enroll") {
      return (
        <div className="p-4">
          <span className="text-center font-medium">
            Delete operation is not supported for this action
          </span>
        </div>
      );
    }
    return (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" value={id} />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    );
  }

  return type === "create" || type === "update" || type === "changePassword" || type === "enroll" 
    ? forms[table](setOpen, type, data, relatedData)
    : "Form not found!";
};
  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        {type==="changePassword"?<button className="rounded-md bg-black text-white py-2 px-4">
          Change Password
          </button>
          :<Image src={`/${type}.png`} alt="" width={16} height={16} />}
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;