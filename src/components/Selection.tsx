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
import AttendanceGrid from "./AttendanceGrid";
import axiosInstance from "@/app/_services/GlobalApi";

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

const SelectionClient: React.FC<SelectionClientProps> = ({ grades, classes }) => {
  const today = new Date();
  const [month, setMonth] = useState<Date>(today);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      // Only fetch if grade is selected
      if (selectedGrade) {
        try {
          const monthData = moment(month).format("YYYY-MM");

          const response = await axiosInstance.post("/attendance", {
            gradeId: selectedGrade,
            classId: selectedClass || undefined, // Send undefined if no class is selected
            month: monthData,
          });

          setAttendanceData(response.data);
        } catch (error) {
          console.error("Error fetching attendance:", error);
        }
      } else {
        setAttendanceData([]);
      }
    };

    fetchAttendance();
  }, [selectedGrade, selectedClass, month]);

  const sortedGrades = [...grades].sort((a, b) => a.level - b.level);
  const sortedClasses = [...classes].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  

  return (
    <>
      <div className="flex gap-6 py-6 border border-gray-400 rounded-md px-4 bg-gray-200">
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
                onMonthChange={(value) => setMonth(value)}
                className="flex flex-1 justify-center items-center"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <select
            className="border p-2 rounded bg-white"
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              setSelectedClass(""); // Reset section if grade changes
            }}
          >
            <option value="">Grade</option>
            {sortedGrades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                G-{grade.level}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="border p-2 rounded bg-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={!selectedGrade} // Disable section if no grade is selected
          >
            <option value="">Section</option>
            {sortedClasses.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                Sec-{classItem.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {attendanceData.length>0 ?
      <AttendanceGrid attendanceData={attendanceData} selectedMonth={month} />:""}
    </>
  );
};

export default SelectionClient;
