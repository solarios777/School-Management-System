"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useRouter } from "next/navigation";
import { GridApi } from "ag-grid-community";

interface Student {
  id: string;
  name: string;
  result?: { subject: { name: string }; marks: number; year: string; semester: string }[];
}

interface ResultsTableProps {
  students: Student[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ students }) => {
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]); // Store full dataset
  const gridApiRef = useRef<GridApi | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!students || students.length === 0) return;

    console.log("Received Students Data:", students);

    // Extract subjects dynamically
    const subjects = new Set<string>();
    const studentData: any[] = [];

    students.forEach((student) => {
      if (!student.result) return;

      const studentResults: Record<string, number> = {}; // Store summed marks per subject
      let totalMarks = 0;
      let subjectCount = 0;

      student.result.forEach((res) => {
        const key = `${res.subject.name}-${res.year}-${res.semester}`;
        subjects.add(res.subject.name);

        if (!studentResults[key]) {
          studentResults[key] = 0;
        }
        studentResults[key] += res.marks; // Summing marks

        totalMarks += res.marks;
      });

      subjectCount = Object.keys(studentResults).length;
      const averageMarks = subjectCount > 0 ? totalMarks / subjectCount : 0;

      // Create row object
      const row: any = {
        name: student.name,
        total: totalMarks,
        average: parseFloat(averageMarks.toFixed(2)), // Convert to number for sorting
      };

      Object.entries(studentResults).forEach(([key, value]) => {
        const subjectName = key.split("-")[0]; // Extract subject name
        row[subjectName] = value;
      });

      studentData.push(row);
    });

    // **Initial ranking based on full dataset**
    assignRanks(studentData);

    console.log("Formatted Row Data:", studentData);

    // Define columns dynamically
    const dynamicColumns = [
          {
  headerName: "Roll No.",
  valueGetter: (params:any) => params.node.rowIndex + 1, // Dynamic roll number based on visible row index
  width: 90,
  pinned: "left",
  sortable: false, // Prevent sorting from affecting roll number
  filter: false,   // Prevent filtering from affecting roll number
},
      { headerName: "Student Name", field: "name", pinned: "left", width: 200 },
      ...Array.from(subjects).map((subject) => ({
        headerName: subject,
        field: subject,
        width: 150,
        editable: false,
      })),
      { headerName: "Total", field: "total", width: 120, editable: false },
      { headerName: "Average", field: "average", width: 120, editable: false },
      { headerName: "Rank", field: "rank", width: 100, editable: false },
    ];

    setColumnDefs(dynamicColumns);
    setRowData(studentData);
    setOriginalData(studentData); // Store original dataset with ranks
  }, [students]);

  // **Function to assign correct ranks (Handles duplicate averages)**
  const assignRanks = (data: any[]) => {
    data.sort((a, b) => b.average - a.average); // Sort descending by average

    let rank = 1;
    for (let i = 0; i < data.length; i++) {
      if (i > 0 && data[i].average === data[i - 1].average) {
        // If the average is the same as the previous, assign the same rank
        data[i].rank = data[i - 1].rank;
      } else {
        // Otherwise, assign the current rank
        data[i].rank = rank;
      }
      rank++; // Increase rank for the next unique average
    }
  };

  // Function to update ranks dynamically on filtering
  const updateRanks = () => {
    if (!gridApiRef.current) return;

    const filteredData = gridApiRef.current.getDisplayedRowCount() > 0
      ? gridApiRef.current.getRenderedNodes().map((node) => node.data)
      : [...originalData]; // Restore full dataset if filtering is cleared

    // If no filters are applied, restore the original data
    if (filteredData.length === originalData.length) {
      setRowData([...originalData]); // Reset to the original dataset with ranks
      return;
    }

    // Recalculate ranks for filtered data
    assignRanks(filteredData);
    setRowData([...filteredData]);
  };

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
    }),
    []
  );

  return (
    <div className="ag-theme-alpine" style={{ height: "700px", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 30, 50, 100]}
        defaultColDef={defaultColDef}
        onGridReady={(params) => (gridApiRef.current = params.api)}
        onFilterChanged={updateRanks} // Update ranks when filters change
        onSortChanged={updateRanks} // Update ranks when sorting changes
      />
    </div>
  );
};

export default ResultsTable;
