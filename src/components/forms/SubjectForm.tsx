"use cleint";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { subjectSchema, SubjectSchema } from "../../../schema";
import { Button } from "../ui/button";
import InputField from "../InputField";
import { createSubject, updateSubject } from "../../../actions/subjectRegister";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const SubjectForm = ({
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
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });
  const router=useRouter();
  const [state,formAction]=useFormState(type==="create"?createSubject:updateSubject,{
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
  

  

    return (
    <form className="flex flex-col gap-8 " onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">{type==="create"?"Create a new subject":"Update the Subject"} </h1>
<div className="flex justify-between flex-wrap gap-4 ">

         <InputField
            label="subject"
            name="name"
            register={register}
            defaultValue={data?.name}
            error={errors.name}
            placeholder="Enter subject name"
            // disabled={isPending}
          />
           {data && <InputField
            label="id"
            name="id"
            register={register}
            defaultValue={data?.id}
            error={errors.id}
            hidden
            // placeholder="Enter subject name"
            // disabled={isPending}
          />}
        
        </div>
        <Button className="rounded-md">{type==="create"?"Create Subject":"Update Subject"}</Button>

    </form>
    )
}

export default SubjectForm