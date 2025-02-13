import React, { useState } from "react";
import Selection from "@/components/Selection";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const AttendancePage = async() => {
  const grades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  const classes = await prisma.class.findMany({
    select: { id: true, name: true },
  });
  
  return (
    <div className="px-10 py-5">
      <h2 className="text-2xl font-bold">Attendance</h2>
      {/* Search Options */}
      <div >
        <div>
          {/* <label >Select Month</label> */}
          <Selection grades={grades} classes={classes}/>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
