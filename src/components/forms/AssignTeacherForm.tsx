"use cleint";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { teacherAssignmentSchema, TeacherAssignmentSchema } from "../../../schema";
import { Button } from "../ui/button";
import InputField from "../InputField";
import { createSubject } from "../../../actions/subjectRegister";
import { useFormState } from "react-dom";
import { error } from "console";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createTeacherAssignment } from "../../../actions/teacherAssign";




const AssignTeacherForm = ({
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
  } = useForm<TeacherAssignmentSchema>({
    resolver: zodResolver(teacherAssignmentSchema),
  });
  const router=useRouter();
    const [academicYears, setAcademicYears] = useState<string[]>([]);
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
  useEffect(() => {
      const generateAcademicYears = () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // Month is zero-based (Jan = 0)
        
        // If the current month is before September, the academic year is the previous year
        const startYear = currentMonth < 9 ? currentYear - 1 : currentYear;
  
        const years: string[] = [];
        for (let i = -2; i < 3; i++) { // Generate 5 academic years dynamically
          const nextYear = startYear + i;
          years.push(`${nextYear}/${(nextYear + 1) % 100}`); // Format: YYYY/YY
        }
        return years;
      };
  
      setAcademicYears(generateAcademicYears());
    }, []);

  const { teachers,classes,subjects,grades } =relatedData;
 
  
  
  
  

    return (
    <form className="flex flex-col gap-8 " onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">{type==="enroll"?"Assign teacher for a subject":"Update the assignment"} </h1>
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
    ...grades
      .sort((a: { level: number }, b: { level: number }) => a.level - b.level)
      .map((gradeItem: { id: string; level: number }) => ({
        value: gradeItem.id,
        label: `Grade ${gradeItem.level}`,
      })),
  ]}
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

       
        <InputField
  label="Year"
  name="year"
  register={register}
  error={errors.year}
  as="select"
  options={[
    { value: "", label: "Select Year" },
    ...academicYears.map((year) => ({
      value: year,
      label: year,
    })),
  ]}
/>
          </div>
        <Button className="rounded-md">{type==="enroll"?"Assign teacher":"Update Assignment"}</Button>

    </form>
    )
}

export default AssignTeacherForm