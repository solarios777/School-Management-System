"use cleint";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { teacherAssignmentSchema, TeacherAssignmentSchema } from "../../../schema";
import { Button } from "../ui/button";
import InputField from "../InputField";
import { createSubject } from "../../../actions/subjectRegister";
import { useFormState } from "react-dom";
import { error } from "console";
import { Dispatch, SetStateAction, use, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createTeacherAssignment } from "../../../actions/teacherAssign";




const AssignTeacherForm = async({
    type,
    data,
    setOpen,
    relatedData
}:{
    type:"create" | "update",
    data?:any,
    setOpen:Dispatch<SetStateAction<boolean>>,
    relatedData?:any
}) => {
     const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherAssignmentSchema>({
    resolver: zodResolver(teacherAssignmentSchema),
  });
  const router=useRouter();
  const [state,formAction]=useFormState(createTeacherAssignment,{
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

  const { teachers,classes,subjects } =await relatedData;
 
  

    return (
    <form className="flex flex-col gap-8 " onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">{type==="create"?"Create a new subject":"Update the Subject"} </h1>
<div className="flex justify-between flex-wrap gap-4 ">

           <InputField
  label="subjects"
  name="subjectname"
  register={register}
  error={errors.subjectname}
  as="select"
  options={[
    { value: "", label: "Select subject" },
    ...subjects.sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)).map((subjectItem: { id: string; name: string }) => ({
      value: subjectItem.id,
      label: subjectItem.name,
    })),
  ]}
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
  label="teacher"
  name="teachername"
  register={register}
  error={errors.teachername}
  as="select"
  options={[
    { value: "", label: "Select Teacher" },
    ...teachers.sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)).map((teacher: { id: string; name: string }) => ({
      value: teacher.id,
      label: teacher.name,
    })),
  ]}
/>
{/* 
               <div className="flex flex-col gap-2 w-full md:w-1/4">
  <label className="text-xs text-gray-500">Section</label>
  <select
    multiple
    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
    {...register("classname")}
    defaultValue={data?.classname || []}
  >
    <option value="" disabled>
      Select sections
    </option>
    {classes
      .sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)
      )
      .map((classItem: { id: string; name: string }) => (
        <option key={classItem.id} value={classItem.id}>
          {classItem.name}
        </option>
      ))}
  </select>
  {errors.classname?.message && (
    <p className="text-xs text-red-400">{errors.classname.message}</p>
  )}
</div> */}

         {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teachername")}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.teachername?.message && (
            <p className="text-xs text-red-400">
              {errors.teachername.message.toString()}
            </p>
          )}
        </div> */}
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
        <Button className="rounded-md">{type==="create"?"Create Subject":"Update Subject"}</Button>

    </form>
    )
}

export default AssignTeacherForm