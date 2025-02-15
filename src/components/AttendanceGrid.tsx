import React, { useEffect, useState } from "react";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AttendanceCheckbox from "./AttendanceCheckbox";
import { ColDef } from "ag-grid-community";
import axiosInstance from "@/app/_services/GlobalApi";

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
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: "Username", field: "username", filter: true },
    { headerName: "Student Name", field: "name", filter: true },
  ]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (attendanceData) {
      const userList: Student[] = getUniqueRecord();
      setRowData(userList);
      updateColumnDefs();
    }
  }, [attendanceData, selectedDay]);

  const updateColumnDefs = () => {
    const updatedColumnDefs: ColDef[] = [
      {
        headerName: "Username",
        field: "username",
        filter: true,
        floatingFilter: true,
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

  const getUniqueRecord = (): Student[] => {
    const uniqueRecord: Student[] = [];
    const existingUser = new Set<string>();

    attendanceData?.forEach((record) => {
      if (!existingUser.has(record.id)) {
        existingUser.add(record.id);
        uniqueRecord.push(record);
      }
    });

    return uniqueRecord;
  };

  const daysInMonth = (year: any, month: any) =>
    new Date(year, month + 1, 0).getDate();
  const numberOfDays = daysInMonth(
    moment(selectedMonth).format("YYYY"),
    moment(selectedMonth).format("MM")
  );
  const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedDay(value ? parseInt(value) : null);
  };

  const handleMarkAllPresent = async () => {
    if (selectedDay) {
      try {
        await Promise.all(
          rowData.map(async (student) => {
            await axiosInstance.patch("/attendance", {
              studentId: student.id,
              date: moment(selectedMonth)
                .date(selectedDay)
                .format("YYYY-MM-DD"),
              status: "PRESENT",
            });
          })
        );

        // Update the UI after successful update
        setRowData((prevData) =>
          prevData.map((student) => {
            const updatedAttendance = student.attendance.map((att) =>
              att.day === selectedDay ? { ...att, status: "PRESENT" } : att
            );
            return { ...student, attendance: updatedAttendance };
          })
        );
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
