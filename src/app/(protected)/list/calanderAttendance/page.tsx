"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSearchParams, useRouter } from "next/navigation";
import { startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval, getDay } from "date-fns";
import { fetchStudentAttendance, fetchStudentDetails } from "@/app/_services/GlobalApi"; // Ensure this function exists

interface Attendance {
  date: string;
  status: string;
}

const AttendanceCalendar: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentId = searchParams.get("studentId");

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<Record<string, Attendance[]>>({});
  const [studentName, setStudentName] = useState<string | null>(null);

  const fetchAttendance = async (months: Date[]) => {
    if (studentId) {
      const newAttendanceData: Record<string, Attendance[]> = {};
      for (const month of months) {
        const formattedMonth = moment(month).format("YYYY-MM");
        const data = await fetchStudentAttendance(studentId, formattedMonth);
        newAttendanceData[formattedMonth] = data;
      }
      setAttendanceData(newAttendanceData);
    }
  };

  useEffect(() => {
    if (studentId) {
      const monthsToFetch = [currentMonth, addMonths(currentMonth, -1), addMonths(currentMonth, -2), addMonths(currentMonth, -3)];
      fetchAttendance(monthsToFetch);

      // Fetch student name
      fetchStudentDetails(studentId).then((data) => {
        setStudentName(data?.name || "Unknown Student");
      });
    } else {
      router.push("/list");
    }
  }, [currentMonth, studentId]);

  const getDayStyle = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const formattedMonth = moment(date).format("YYYY-MM");
    const attendance = attendanceData[formattedMonth]?.find(a => moment(a.date).format("YYYY-MM-DD") === formattedDate);

    if (!attendance) return "bg-white";
    switch (attendance.status) {
      case "PRESENT":
        return "bg-green-500 text-white";
      case "LATE":
        return "bg-yellow-400 text-black";
      case "ABSENT":
        return "bg-red-500 text-white";
      default:
        return "bg-white";
    }
  };

  const getAttendanceSummary = (month: string) => {
    const data = attendanceData[month] || [];
    const summary = { PRESENT: 0, ABSENT: 0, LATE: 0 };

    data.forEach(({ status }) => {
      if (status in summary) {
        summary[status as keyof typeof summary]++;
      }
    });

    return summary;
  };

  const renderMonth = (monthOffset: number) => {
    const monthDate = addMonths(currentMonth, monthOffset);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });
    const firstDayOffset = getDay(start);
    const formattedMonth = moment(monthDate).format("YYYY-MM");
    const summary = getAttendanceSummary(formattedMonth);

    return (
      <div className="mb-8 border p-4 shadow-md bg-gray-100">
        <h2 className="text-xl font-bold text-center mb-2">{moment(monthDate).format("MMMM YYYY")}</h2>
        <div className="grid grid-cols-7 text-center font-semibold text-gray-600">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-1 border-t">
          {Array(firstDayOffset).fill(null).map((_, i) => <div key={"empty-" + i}></div>)}
          {days.map((day, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center border ${getDayStyle(day)}`}
            >
              {day.getDate()}
            </div>
          ))}
        </div>
        <div className="mt-2 text-center font-semibold">
          <p className="text-green-600">Present: {summary.PRESENT}</p>
          <p className="text-yellow-600">Late: {summary.LATE}</p>
          <p className="text-red-600">Absent: {summary.ABSENT}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto p-4">
      {studentName && <h1 className="text-2xl font-bold text-center mb-4">{studentName}&apos;s Attendance</h1>}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded bg-gray-300">Previous</button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded bg-gray-300">Next</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderMonth(0)}
        {renderMonth(-1)}
        {renderMonth(-2)}
        {renderMonth(-3)}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
