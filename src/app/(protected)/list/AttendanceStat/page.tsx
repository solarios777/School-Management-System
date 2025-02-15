import React, { useState } from "react";
import prisma from "@/lib/prisma";
import ChartSelection from "@/components/ChartSelection";

const Page = async() => {
  const grades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  const classes = await prisma.class.findMany({
    select: { id: true, name: true },
  });
  
  return (
    <div className="px-10 py-5">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {/* Search Options */}
      <div >
        <div>
          <ChartSelection grades={grades} classes={classes}/>
        </div>
      </div>
    </div>
  );
};

export default Page;
