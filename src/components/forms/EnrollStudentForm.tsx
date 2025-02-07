"use cleint";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { studentEnrollmentSchema, StudentEnrollmentSchema, teacherAssignmentSchema, TeacherAssignmentSchema } from "../../../schema";
import { Button } from "../ui/button";
import InputField from "../InputField";
import { createSubject } from "../../../actions/subjectRegister";
import { useFormState } from "react-dom";
import { error } from "console";
import { Dispatch, SetStateAction, use, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createTeacherAssignment } from "../../../actions/teacherAssign";
import { EnrollStudent } from "../../../actions/studentEnrollment";




const EnrollStudentForm = ({
    type,
    data,
    setOpen,
    relatedData
}:{
    type:"create" | "update"|"changePassword" | "enroll",
    data?:any,
    setOpen:Dispatch<SetStateAction<boolean>>,
    relatedData?:any
}) => {
     const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentEnrollmentSchema>({
    resolver: zodResolver(studentEnrollmentSchema),
  });
  const router=useRouter();
  const [state,formAction]=useFormState(EnrollStudent,{
    success:false,
    error:false,
    message:""
  });
  
  const onSubmit = handleSubmit((data) => {
    formAction(data)
  });
  useEffect(() => {
    if (state.success) {
      
      toast.success(state.message);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state]);

  const { classes } =relatedData;
 
  

    return (
    <form className="flex flex-col gap-8 " onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">{type==="enroll"?"Enroll Student":"Update Enrollment"} </h1>
<div className="flex justify-between flex-wrap gap-4 ">

         <InputField
  label="name"
  name="studentname"
  register={register}
  error={errors.studentname}
  defaultValue={data.id}
  hidden
/>

           <InputField
                label="Grade"
                name="grade"
                register={register}
                error={errors.grade}
                as="select"
                options={[
                    { value: "", label: "Select Grade" },
                    ...Array.from({ length: 12 }, (_, index) => ({
                    value: (index + 1).toString(),
                    label: (index + 1).toString(),
                    })),
                ]}
                //   disabled={isPending}
                />
             
<InputField
  label="Section"
  name="classname"
  register={register}
  error={errors.classname}
  as="select"
  options={[
    { value: "", label: "Select section" },
    ...classes.sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)).map((classItem: { id: string; name: string }) => ({
      value: classItem.id,
      label: classItem.name,
    })),
  ]}
/>

 <InputField
          label="Year"
          name="year"
          type="number"
          register={register}
          error={errors.year}
          // disabled={isPending}
          defaultValue={new Date().getFullYear()}
        />
           
       
          </div>
        <Button className="rounded-md">{type==="enroll"?"Enroll":"Update Enrollment"}</Button>

    </form>
    )
}

export default EnrollStudentForm 