"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface Student {
  id: string;
  name: string;
  username: string;
  rollNumber: string;
  [key: string]: any;
}

interface ResultAGGridProps {
  students: Student[];
  assessmentTypes: string[];
}

const ResultAGGrid: React.FC<ResultAGGridProps> = ({ students, assessmentTypes }) => {
  const columnDefs = [
    { headerName: "ID", field: "id", hide: true },
    { headerName: "Roll No", field: "rollNumber", sortable: true },
    { headerName: "Name", field: "name", sortable: true },
    { headerName: "Username", field: "username", sortable: true },
    ...assessmentTypes.map((assessment) => ({
      headerName: assessment,
      field: assessment,
      editable: true,
    })),
  ];

  return <div className="ag-theme-alpine " style={{ height: "700px", width: "100%"}} ><AgGridReact rowData={students} columnDefs={columnDefs} pagination={true} /></div>;
};

export default ResultAGGrid;