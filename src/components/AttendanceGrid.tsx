"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AttendanceCheckbox from "./AttendanceCheckbox";
import { ColDef } from "ag-grid-community";
import axiosInstance from "@/app/_services/GlobalApi";
import Link from "next/link";

type Attendance = {
  date: string;
  day: number;
  status: string;
};

type Student = {
  id: string;
  username: string;
  name: string;
  surname: string;
  attendance: Attendance[];
  rollNumber?: number; // New Roll Number field
};

interface AttendanceListProps {
  attendanceData: Student[];
  selectedMonth: Date;
}

const AttendanceGrid: React.FC<AttendanceListProps> = ({
  attendanceData,
  selectedMonth,
}) => {
  const [rowData, setRowData] = useState<Student[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (attendanceData) {
      const userList: Student[] = getSortedStudentsWithRollNumbers();
      setRowData(userList);
      updateColumnDefs();
    }
  }, [attendanceData, selectedDay]);

  // Function to sort students by name and assign roll numbers
  const getSortedStudentsWithRollNumbers = (): Student[] => {
    return [...attendanceData]
      .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
      .map((student, index) => ({
        ...student,
        rollNumber: index + 1, // Assign roll number
      }));
  };

  const updateColumnDefs = () => {
    const updatedColumnDefs: ColDef[] = [
      { headerName: "No.", field: "rollNumber", width: 60, sortable: true },
      {
        headerName: "Username",
        field: "username",
        filter: true,
        floatingFilter: true,
        cellRenderer: (params: any) => (
          <Link href={`/list/calanderAttendance?studentId=${params.data.id}`}>
            {params.value}
          </Link>
        ),
      },
      {
        headerName: "Student Name",
        field: "name",
        filter: true,
        floatingFilter: true,
      },
    ];

    daysArray.forEach((day) => {
      if (selectedDay === null || selectedDay === day) {
        updatedColumnDefs.push({
          field: day.toString(),
          headerName: day.toString(),
          width: 60,
          cellRenderer: (params: any) => (
            <AttendanceCheckbox data={params.data} day={day} node={params.node} />
          ),
          filter: "agTextColumnFilter",
          floatingFilter: true,
        });
      }
    });

    setColumnDefs(updatedColumnDefs);
  };

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const numberOfDays = daysInMonth(
    moment(selectedMonth).year(),
    moment(selectedMonth).month()
  );

  const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedDay(value ? parseInt(value) : null);
  };

  const handleMarkAllPresent = async () => {
  if (selectedDay) {
    try {
      // Update UI immediately
      const updatedRowData = rowData.map((student) => {
        // Find the attendance record for the selected day
        const attendanceForDay = student.attendance.find(
          (att) => att.day === selectedDay
        );

        // If the attendance record exists, update it to "PRESENT"
        if (attendanceForDay) {
          attendanceForDay.status = "PRESENT";
        } else {
          // If the attendance record doesn't exist, create a new one
          student.attendance.push({
            date: moment(selectedMonth).date(selectedDay).format("YYYY-MM-DD"),
            day: selectedDay,
            status: "PRESENT",
          });
          
          
        }

        return student;
      });

      // Update the state to reflect the changes in the UI
      setRowData([...updatedRowData]);

      // Update backend for ALL students
      await Promise.all(
        updatedRowData.map(async (student) => {
          try {
            await axiosInstance.patch("/attendance", {
              studentId: student.id,
              date: moment(selectedMonth).date(selectedDay).format("YYYY-MM-DD"),
              status: "PRESENT",
            });
          } catch (error) {
            console.error(
              `Failed to update attendance for student ${student.id}:`,
              error
            );
          }
        })
      );

      console.log("All students marked as PRESENT successfully!");
    } catch (error) {
      console.error("Failed to update all students to PRESENT:", error);
    }
  }
};

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="day-select" className="mr-2">
          Select Day:
        </label>
        <select id="day-select" onChange={handleDayChange}>
          <option value="">All Days</option>
          {daysArray.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <input
          type="checkbox"
          id="mark-all-present"
          onChange={(e) => e.target.checked && handleMarkAllPresent()}
          disabled={!selectedDay}
        />
        <label htmlFor="mark-all-present">Mark All Present</label>
      </div>
      <div className="ag-theme-alpine mt-6" style={{ height: "600px", width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 30, 50, 100]}
        />
      </div>
    </>
  );
};

export default AttendanceGrid;