import React, { useState } from "react";
import prisma from "@/lib/prisma";
import SubjectGradeClassForm from "@/components/tasks/SubjectGradeClassForm";
import TeachSubjectGradeClassForm from "@/components/tasks/TeachSubClassRelation";
import { Card } from "@/components/ui/card";
import PeriodTimeTable from "@/components/tasks/periodTime";
import SetResultDeadline from "@/components/Admin/SetResultDeadline";
import ReleaseResults from "@/components/Admin/isReleased";
import CalculateRank from "@/components/Admin/calculateRank";
import SubjectQuotaForm from "@/components/tasks/subjectQouta";
import ScheduleTable from "@/components/tasks/generateSchedule";

const AttendancePage = async () => {
  const grades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  const classes = await prisma.class.findMany({
    select: { id: true, name: true },
  });
  const Subjects = await prisma.subject.findMany({
    select: { id: true, name: true },
  });
  const teachers = await prisma.teacher.findMany({
    select: { id: true, name: true, surname: true },
  });
  return (
    <div className="px-10 py-5 mt-8">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px] justify-center">
            <SubjectGradeClassForm
              subjects={Subjects}
              grades={grades}
              classes={classes}
            />
          </Card>
          <Card className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
            <TeachSubjectGradeClassForm
              subjects={Subjects}
              grades={grades}
              classes={classes}
              teachers={teachers}
            />
          </Card>
          <Card className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
            <SubjectQuotaForm
              subjects={Subjects}
              grades={grades}
              classes={classes}
            />
          </Card>
          <Card className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
            <PeriodTimeTable />
          </Card>
        </div>
        </div>
        <div className="flex flex-col md:flex-row mt-16 gap-4 justify-around">
          <div>
            <SetResultDeadline />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <ReleaseResults />
              </div>
              <div>
                <CalculateRank />
              </div>
            </div>
            <div>
              <ScheduleTable />
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default AttendancePage;
