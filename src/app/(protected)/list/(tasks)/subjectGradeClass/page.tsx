import React, { useState } from "react";
import prisma from "@/lib/prisma";
import SubjectGradeClassForm from "@/components/tasks/SubjectGradeClassForm";

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
  
  return (
    <div className="px-10 py-5">
      
      
      <div >
        <div>
          {/* <label >Select Month</label> */}
          <SubjectGradeClassForm subjects={Subjects} grades={grades} classes={classes}/>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;