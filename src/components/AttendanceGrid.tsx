import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { log } from "node:console";

type Attendance = {
  date: string;
  day: number;
  present: boolean;
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

const AttendanceGrid: React.FC<AttendanceListProps> = ({ attendanceData ,selectedMonth}) => {
  const [rowData, setRowData] = useState<Student[]>([])
  const [columnDefs, setColumnDefs] = useState<any[]>([
  { headerName: "Username", field: "username" },
  { headerName: "Student Name", field: "name" }
]);

 useEffect(() => {
  if (attendanceData) {
    const userList: Student[] = getUniqueRecord();
    setRowData(userList);
    

    // Start with the fixed columns
    const updatedColumnDefs = [
      { headerName: "Username", field: "username" },
      { headerName: "Student Name", field: "name" }
    ];

    // Add day columns
    daysArray.forEach((day) => {
      updatedColumnDefs.push({
        field: day.toString(),width:60,editable: true,
        headerName: day.toString(),
      });
      userList.forEach(obj => {
      obj[day]=true
    })
    });
    

    // Update columnDefs once with the new array
    setColumnDefs(updatedColumnDefs);
  }
}, [attendanceData]);
const isPresent = (studentId: string, day: number) => {

  const result=attendanceData.find((item) => item.attendance.some(attendance => attendance.day === day )&& item.id===studentId); 
}

const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true
    }),
    []
  );
  const getUniqueRecord = (): Student[] => {
    const uniqueRecord: Student[] = [];       // Explicit type for uniqueRecord
    const existingUser = new Set<string>();   // Explicit type for existingUser

    attendanceData?.forEach((record) => {
      if (!existingUser.has(record.id)) {
        existingUser.add(record.name);
        uniqueRecord.push(record);
      }
    });

    return uniqueRecord;
  };
  const daysInMonth=(year:any, month:any)=>new Date(year, month+1,0).getDate()
  const numberOfDays=daysInMonth(moment(selectedMonth).format("YYYY"),moment(selectedMonth).format("MM"))
  const daysArray=Array.from({length:numberOfDays},(_,i)=>i+1)
  
  
  
  return (
    <div className="ag-theme-alpine mt-6"
    style={{ height: "600px", width: "100%" }}
>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        // defaultColDef={defaultColDef}
        paginationPageSize={10}
      />
    </div>
  );
};

export default AttendanceGrid;