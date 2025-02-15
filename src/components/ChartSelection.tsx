"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import moment from "moment";
import { Calendar } from "@/components/ui/calendar";
import StatusList from "./StatusList";
import { fetchAttendanceData } from "@/app/_services/GlobalApi"; // Axios function
import BarCharAtten from "./BarCharAtten";
import PieChartAtten from "./PieChartAtten";

interface Grade {
  id: string;
  level: number;
}

interface Class {
  id: string;
  name: string;
}

interface SelectionClientProps {
  grades: Grade[];
  classes: Class[];
}

interface AttendanceData {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  presentMale: number;
  presentFemale: number;
  absentMale: number;
  absentFemale: number;
  lateMale: number;
  lateFemale: number;
}

const ChartSelection: React.FC<SelectionClientProps> = ({ grades, classes }) => {
  const today = new Date();
  const [month, setMonth] = useState<Date>(today);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  const sortedGrades = [...grades].sort((a, b) => a.level - b.level);
  const sortedClasses = [...classes].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    totalStudents: 0,
    present: 0,
    absent: 0,
    late: 0,
    presentMale: 0,
    presentFemale: 0,
    absentMale: 0,
    absentFemale: 0,
    lateMale: 0,
    lateFemale: 0,
  });

  useEffect(() => {
    const getData = async () => {
      const formattedMonth = moment(month).format("YYYY-MM");
      const data = await fetchAttendanceData(formattedMonth, selectedGrade, selectedClass);
      setAttendanceData(data);
    };
    getData();
  }, [month, selectedGrade, selectedClass]);

  return (
    <>
      <div className="flex gap-6 py-6 rounded-md px-4">
        {/* Month Selector */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {moment(month).format("MMMM, YYYY")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                month={month}
                onMonthChange={setMonth}
                className="flex flex-1 justify-center items-center"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Grade Selector */}
        <div>
          <select
            className="border p-2 rounded bg-white"
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              setSelectedClass(""); // Reset section on grade change
            }}
          >
            <option value="">All Grades</option>
            {sortedGrades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                G-{grade.level}
              </option>
            ))}
          </select>
        </div>

        {/* Section Selector */}
        <div>
          <select
            className="border p-2 rounded bg-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={!selectedGrade} // Disable unless a grade is selected
          >
            <option value="">All Sections</option>
            {sortedClasses.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                Sec-{classItem.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Summary */}
      <StatusList attendanceData={attendanceData} />
      <div className="grid grid-cols-1 md:grid-cols-2">
        <BarCharAtten />
        <PieChartAtten attendanceData={attendanceData} />
      </div>
    </>
  );
};

export default ChartSelection;
