import React, { useState } from "react";
import prisma from "@/lib/prisma";
import SubjectGradeClassForm from "@/components/tasks/SubjectGradeClassForm";
import TeachSubjectGradeClassForm from "@/components/tasks/TeachSubClassRelation";
import { Card } from "@/components/ui/card";

const AttendancePage = async() => {
  const grades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  const classes = await prisma.class.findMany({
    select: { id: true, name: true },
  });
  const Subjects=await prisma.subject.findMany({
    select: { id: true, name: true },
  })
  const teachers=await prisma.teacher.findMany({
    select: { id: true, name: true, surname: true },
  })
  return (
    <div className="px-10 py-5">
      
      
      <div >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px] justify-center">
              <SubjectGradeClassForm subjects={Subjects} grades={grades} classes={classes}/>
          </Card>
          <Card className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
             <TeachSubjectGradeClassForm subjects={Subjects} grades={grades} classes={classes} teachers={teachers}/>
          </Card>
          <Card className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
              <SubjectGradeClassForm subjects={Subjects} grades={grades} classes={classes}/>
          </Card>
          <Card className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
             <TeachSubjectGradeClassForm subjects={Subjects} grades={grades} classes={classes} teachers={teachers}/>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;