"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { teacherAssignmentSchema } from "../../../schema/index";
import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";
import InputField from "../InputField";

import { Teacher, Class, Grade, Subject } from "@prisma/client";
import { getTeachers, getClasses, getGrades, getSubjects } from "@/lib/actions";
import { TeacherAssign } from "../../../actions/teacherAssign";

export const TeacherAssignmentForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersData = await getTeachers();
        const classesData = await getClasses();
        const gradesData = await getGrades();
        const subjectsData = await getSubjects();

        if (teachersData.data) setTeachers(teachersData.data);
        if (classesData.data) setClasses(classesData.data);
        if (gradesData.data) setGrades(gradesData.data);
        if (subjectsData.data) setSubjects(subjectsData.data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof teacherAssignmentSchema>>({
    resolver: zodResolver(teacherAssignmentSchema),
    defaultValues: {
      teachername: "",
      classname: "",
      subjectname: "",
      grade: 0,
      year: new Date().getFullYear(),
    },
  });

  const onSubmit = (values: z.infer<typeof teacherAssignmentSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      TeacherAssign(values).then((res) => {
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
      headerLebel="Create a Teacher Assignment"
      backButtonLabel="Back to Dashboard"
      backButtonHref="/dashboard"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <h1 className="text-xl font-semibold">Assign Teacher</h1>

        <InputField
          label="Teacher"
          name="teachername"
          register={register}
          as="select"
          error={errors.teachername}
          
          options={[
            { value: "", label: "Select Teacher" },
            ...teachers.map((teacher) => ({
              value: teacher.id,
              label: teacher.username,
            })),
          ]}
          disabled={isPending || teachers.length === 0}
        />
<InputField
          label="Subject"
          name="subjectname"
          register={register}
          error={errors.subjectname}
          as="select"
          options={[
            { value: "", label: "Select Subject" },
            ...subjects.map((subject) => ({
              value: subject.id,
              label: subject.name,
            })),
          ]}
          disabled={isPending || subjects.length === 0}
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
          label="Class"
          name="classname"
          register={register}
          error={errors.classname}
          as="select"
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

        <FormError message={error} />
        <Formsuccess message={success} />

        <Button type="submit" className="w-full" disabled={isPending}>
          Assign Teacher
        </Button>
      </form>
    </CardWrapper>
  );
};
