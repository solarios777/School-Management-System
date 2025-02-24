"use client";
import React, { useMemo, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useRouter } from "next/navigation";

const AGgrid = ({
  columns,
  data,
  list,
  role
}: {
  columns: { header: string; accessor: string; className?: string }[];
  data: any[];
  list: string;
  role: any;
}) => {
  const router = useRouter();
  const gridRef = useRef<any>(null);

  // Function to dynamically calculate roll numbers based on the displayed rows
  const updateRollNumbers = useCallback(() => {
    if (!gridRef.current) return [];

    return gridRef.current.api.getDisplayedRowCount(); // Returns visible row count
  }, []);

 const columnDefs = useMemo(() => {
  return [
    {
      headerName: "Roll No.",
      valueGetter: (params) => {
        const rowIndex = params.node.rowIndex; // This is based on the displayed row
        return rowIndex !== null ? rowIndex + 1 : "";
      },
      width: 90,
      pinned: "left",
      sortable: false,
      filter: false,
    },
    ...columns.map((col) => ({
      headerName: col.header,
      field: col.accessor,
      cellClass: col.className,
      cellRenderer:
        col.accessor === "link"
          ? (params: any) => (
              <span className="text-blue-500 hover:underline">{params.value}</span>
            )
          : undefined,
    })),
  ];
}, [columns]);



  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      floatingFilter: true,
    }),
    []
  );

  const handleRowClick = (event: any) => {
    const Id = event.data.id;
    router.push(`/list/${list}/${Id}`);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "700px", width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 30, 50, 100]}
        defaultColDef={defaultColDef}
        onRowClicked={handleRowClick}
        onFilterChanged={updateRollNumbers} // Update roll numbers when filtering
        onSortChanged={updateRollNumbers} // Update roll numbers when sorting
      />
    </div>
  );
};

export default AGgrid;
