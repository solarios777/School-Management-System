import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/_services/GlobalApi";
import { log } from "util";

interface AttendanceCheckboxProps {
  data: any;
  node: any;
  day: number;
}

const AttendanceCheckbox: React.FC<AttendanceCheckboxProps> = ({ data, node, day }) => {
  const [status, setStatus] = useState<string | null>(null);
  const studentId = data.id;

  useEffect(() => {
    const dayAttendance = data.attendance.find((att: any) => att.day === day);
    if (dayAttendance) {
      setStatus(dayAttendance.status);
    } else {
      setStatus(null); // No attendance record for this day
    }
  }, [data, day]);

  const updateAttendance = async (newStatus: string | null) => {
    try {
      const date = data.attendance.find((att: any) => att.day === day)?.date || new Date();
      await axiosInstance.patch("/attendance", {
        studentId,
        date,
        status: newStatus,
      });
      
    } catch (error) {
      console.error("Failed to update attendance:", error);
    }
  };

  const handleClick = async () => {
    let newStatus: string | null = null;
    if (status === null) {
      newStatus = "PRESENT";
    } else if (status === "PRESENT") {
      newStatus = "ABSENT";
    } else if (status === "ABSENT") {
      newStatus = "LATE";
    } else if (status === "LATE") {
      newStatus = null;
    }

    setStatus(newStatus);
    await updateAttendance(newStatus);
  };
  

  return (
  <div
    onClick={handleClick}
    className={`rounded w-5 h-5 border border-gray-300 cursor-pointer ${
      status === null
        ? "bg-white"
        : status === "PRESENT"
        ? "bg-green-500"
        : status === "ABSENT"
        ? "bg-red-500"
        : "bg-yellow-500"
    }`}
    title={
      status === null
        ? "EMPTY"
        : status === "PRESENT"
        ? "PRESENT"
        : status === "ABSENT"
        ? "ABSENT"
        : "LATE"
    }
  />
);

};

export default AttendanceCheckbox;
