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
import AttendanceGrid from "@/components/AttendanceGrid";
import axiosInstance from "@/app/_services/GlobalApi";

interface SingleSectionAttendanceProps {
  gradeId: string;
  classId: string;
}

const SingleSectionAttendance: React.FC<SingleSectionAttendanceProps> = ({
  gradeId,
  classId,
}) => {
  const today = new Date();
  const [month, setMonth] = useState<Date>(today);
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch attendance data on mount or when the month changes
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const monthData = moment(month).format("YYYY-MM");

        const response = await axiosInstance.post("/attendance", {
          gradeId,
          classId,
          month: monthData,
        });

        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAttendance();
  }, [gradeId, classId, month]);

  return (
    <div className="p-4 bg-white rounded-md">
      <h1 className="text-lg font-semibold mb-4">Attendance Status</h1>
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
      </div>
      <AttendanceGrid attendanceData={attendanceData} selectedMonth={month} />
    </div>
  );
};

export default SingleSectionAttendance;
