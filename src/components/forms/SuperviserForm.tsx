"use cleint";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { superviserSchema,SuperviserSchema} from "../../../schema";
import { Button } from "../ui/button";
import InputField from "../InputField";
import { useFormState } from "react-dom";
import { error } from "console";
import { Dispatch, SetStateAction, use, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createSuperviser } from "../../../actions/AssignSuperviser";




const SuperviserForm = ({
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
  } = useForm<SuperviserSchema>({
    resolver: zodResolver(superviserSchema),
  });
  const router=useRouter();
  const [state,formAction]=useFormState(createSuperviser,{
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

  const { teachers,classes } = relatedData;
 
  

    return (
    <form className="flex flex-col gap-8 " onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">{type==="create"?"Create a new Superviser":"Update the Superviser"} </h1>
<div className="flex justify-between flex-wrap gap-4 ">
           <InputField
                label="Grade"
                name="grade"
                register={register}
                defaultValue={data?.item.level}
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
  defaultValue={data?.gc.class.id} // Use class ID instead of name
  error={errors.classname}
  as="select"
  options={[
    { value: "", label: "Select section" },
    ...classes
      .sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)
      )
      .map((classItem: { id: string; name: string }) => ({
        value: classItem.id, // ID as the value
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

export default SuperviserForm