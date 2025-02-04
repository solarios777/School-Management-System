"use cleint";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TeacherSchema, teacherSchema } from "../../../schema";
import { Button } from "../ui/button";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createTeacher, updateTeacher } from "../../../actions/teacherRegister";



 
const TeacherForm = ({
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
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });
  
   const router=useRouter();
  const [state,formAction]=useFormState(type==="create"?createTeacher:updateTeacher,{
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
      toast.success(state.password);
      

      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state]);
    return (
    <form className="flex flex-col gap-8 h-screen overflow-y-scroll md:h-auto md:overflow-hidden p-8 md:p-0" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">{type==="create"?"Create a new Teacher":"Update Teacher info"} </h1>
        <span className="text-xs text-gray-400 font-medium">Authentication information</span>
<div className="flex justify-between flex-wrap gap-4 ">

        
        <InputField
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            type="email"
            defaultValue={data?.email}
            // disabled={isPending}
          />
          {data && <InputField
            label="id"
            name="id"
            register={register}
            defaultValue={data?.id}
            error={errors.id}
            // hidden
            // placeholder="Enter subject name"
            // disabled={isPending}
          />}
          </div>
       <span className="text-xs text-gray-400 font-medium">Personal information</span>
<div className="flex justify-between flex-wrap gap-4 ">
         <InputField
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            defaultValue={data?.name}
            // disabled={isPending}
          />
          

          <InputField
            label="Surname"
            name="surname"
            register={register}
            error={errors.surname}
            defaultValue={data?.surname}
            // disabled={isPending}
          />
           <InputField
            label="Phone"
            name="phone"
            register={register}
            error={errors.phone}
            type="tel"
            defaultValue={data?.phone}
            // disabled={isPending}
          />
          <InputField
            label="Address"
            name="address"
            register={register}
            error={errors.address}
            defaultValue={data?.address}
            // disabled={isPending}
          />

          <InputField
            label="Blood Type"
            name="bloodType"
            as="select"
            register={register}
            error={errors.bloodType}
            defaultValue={data?.bloodType}
            options={[
              { value: "", label: "Select Blood Type" },
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
            ]}
          />

          <InputField
            label="Sex"
            name="sex"
            as="select"
            register={register}
            error={errors.sex}
            defaultValue={data?.sex}
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ]}
          />

          <InputField
            label="Birthday"
            name="birthday"
            type="date"
            register={register}
            error={errors.birthday}
            defaultValue={data?.birthday.toLocaleDateString("en-CA")}
            // disabled={isPending}
          />

          <InputField
            label="Role"
            name="role"
            as="select"
            register={register}
            error={errors.role}
            defaultValue={data?.role}
            options={[
              { value: "TEACHER", label: "Teacher" },
              { value: "ADMIN", label: "Admin" },
            ]}
          />
          </div>
        <Button className="rounded-md">{type==="create"?"Create":"Update"}</Button>

    </form>
    )
}

export default TeacherForm