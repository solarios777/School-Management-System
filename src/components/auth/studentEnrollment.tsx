"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { studentEnrollmentSchema } from "../../../schema/index";
import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";
import { Teacher, Class, Grade, Subject } from "@prisma/client";
import { getTeachers, getClasses, getGrades, getSubjects } from "@/lib/actions";
import { StudentEnrollment } from "../../../actions/studentEnrollment";
import InputField from "../InputField";


export const StudentEnrollmentForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersData = await getTeachers();
        const classesData = await getClasses();
        const gradesData = await getGrades();

        if (teachersData.data) setTeachers(teachersData.data);
        if (classesData.data) setClasses(classesData.data);
        if (gradesData.data) setGrades(gradesData.data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
  }, []);

  const { control, register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof studentEnrollmentSchema>>({
    resolver: zodResolver(studentEnrollmentSchema),
    defaultValues: {
      studentname: "",
      classname: "",
      grade: 0,
      year: new Date().getFullYear(),
    },
  });

  const onSubmit = (values: z.infer<typeof studentEnrollmentSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      StudentEnrollment(values).then((res) => {
        if (res.success) {
          setSuccess(res.success);
          setError("");
        }
        if (res.error) {
          setError(res.error);
          setSuccess("");
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLebel="Enroll a Student"
      backButtonLabel="Back to Dashboard"
      backButtonHref="/dashboard"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <InputField
             register={register}
            as="select"
            error={errors.studentname}
            name="studentname"
            label="Student"
            type="select"
            options={[
              { value: "", label: "Select Student" },
              ...teachers.map((teacher) => ({
                value: teacher.id,
                label: teacher.username,
              })),
            ]}
            disabled={isPending || teachers.length === 0}
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
  disabled={isPending}
/>
          <InputField
            register={register}
            error={errors.classname}
            as="select"
            name="classname"
            label="Class"
            type="select"
            options={[
              { value: "", label: "Select Class" },
              ...classes.map((class_) => ({
                value: class_.id,
                label: class_.name,
              })),
            ]}
            disabled={isPending || classes.length === 0}
          />
          <InputField
          label="Year"
          name="year"
          type="number"
          register={register}
          error={errors.year}
          disabled={isPending}
          defaultValue={new Date().getFullYear()}
        />
        </div>

        <FormError message={error} />
        <Formsuccess message={success} />

        <Button type="submit" className="w-full" disabled={isPending}>
          Enroll Student
        </Button>
      </form>
    </CardWrapper>
  );
};
