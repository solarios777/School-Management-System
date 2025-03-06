"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { superviserSchema, SuperviserSchema } from "../../../schema";
import { Button } from "../ui/button";
import InputField from "../InputField";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createSuperviser } from "../../../actions/AssignSuperviser";

const SuperviserForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update" | "changePassword" | "enroll";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuperviserSchema>({
    resolver: zodResolver(superviserSchema),
  });

  const router = useRouter();
  const [state, formAction] = useFormState(createSuperviser, {
    success: false,
    error: false,
    message: "",
  });

  const [academicYears, setAcademicYears] = useState<string[]>([]);

  const onSubmit = handleSubmit((data) => {
    formAction(data);
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
      const startYear = new Date().getMonth() + 1 < 9 ? currentYear - 1 : currentYear;
      return Array.from(
        { length: 5 },
        (_, i) => `${startYear + i - 2}/${(startYear + i - 1) % 100}`
      );
    };

    setAcademicYears(generateAcademicYears());
  }, []);

  const { teachers, classes, grades } = relatedData;

  const sortedGrades = [...grades].sort((a, b) => a.level - b.level);
  const sortedClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "enroll" ? "Create a new Superviser" : "Update the Superviser"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        {/* Grade Selection */}
        <InputField
          label="Grade"
          name="grade"
          register={register}
          defaultValue={data?.item.level}
          error={errors.grade}
          as="select"
          options={[
            { value: "", label: "Select Grade" },
            ...sortedGrades.map((grade) => ({
              value: grade.level.toString(),
              label: grade.level.toString(),
            })),
          ]}
        />

        {/* Class Selection */}
        <InputField
          label="Section"
          name="classname"
          register={register}
          defaultValue={data?.gc.class.id} // Use class ID instead of name
          error={errors.classname}
          as="select"
          options={[
            { value: "", label: "Select section" },
            ...sortedClasses.map((classItem) => ({
              value: classItem.id, // ID as the value
              label: classItem.name,
            })),
          ]}
        />

        {/* Teacher Selection */}
        <InputField
          label="Teacher"
          name="teachername"
          register={register}
          error={errors.teachername}
          as="select"
          options={[
            { value: "", label: "Select Teacher" },
            ...teachers
              .sort((a:any, b:any) => a.name.localeCompare(b.name))
              .map((teacher:any) => ({
                value: teacher.id,
                label: teacher.name,
              })),
          ]}
        />

        {/* Year Selection */}
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
      <Button className="rounded-md">
        {type === "enroll" ? "Create Superviser" : "Update Superviser"}
      </Button>
    </form>
  );
};

export default SuperviserForm;