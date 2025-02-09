"use client";
import React, { useMemo, useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";



interface SectionDetail {
  sectionName: string;
  students: number;
  supervisor: string;
}

interface GradeData {
  id: string;
  level: string;
  sections: number;
  students: number;
  detail: SectionDetail[];
  isRowMaster?: boolean;
}

interface ClassAGGridProps {
  data: GradeData[];
  role: string;
}

const ClassAGGrid: React.FC<ClassAGGridProps> = ({ data, role }) => {
  // Add `isRowMaster` dynamically
  const rowData = useMemo(
    () =>
      data.map((row) => ({
        ...row,
        isRowMaster: row.detail && row.detail.length > 0, // Ensure `detail` exists
      })),
    [data]
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Grade",
        field: "level",
        callRenderer:"agGroupCallRenderer",
      },
      { headerName: "Number of Sections", field: "sections" },
      { headerName: "Number of Students", field: "students" },
    ],
    []
  );

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, floatingFilter: true }), []);
   const [gridApi,setgridApi]=useState() 
   const onGridReady = (params: any) => {
  setgridApi(params)
}
  const detailCellRenderer = useCallback(({ data }: { data: GradeData }) => {

    return (
      <div style={{ padding: "10px" }}>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Section Name</th>
              <th className="border p-2">Number of Students</th>
              <th className="border p-2">Supervisor</th>
            </tr>
          </thead>
          <tbody>
            {data.detail.length > 0 ? (
              data.detail.map((section, index) => (
                <tr key={index}>
                  <td className="border p-2">{section.sectionName}</td>
                  <td className="border p-2">{section.students}</td>
                  <td className="border p-2">{section.supervisor}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="border p-2 text-center">
                  No sections available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: "700px", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        masterDetail={true}
        detailCellRenderer={detailCellRenderer}
        
      />
    </div>
  );
};

export default ClassAGGrid;
