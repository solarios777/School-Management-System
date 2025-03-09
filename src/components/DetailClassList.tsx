"use client";
import React, { useState, useMemo, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { classDelete } from "@/app/_services/deleteApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AGgrid = ({
  columns,
  data,
  list,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  data: any[];
  list: string;
}) => {
  const router = useRouter();
  const gridRef = useRef<any>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [deleteTimeout, setDeleteTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateRollNumbers = useCallback(() => {
    if (!gridRef.current) return [];
    return gridRef.current.api.getDisplayedRowCount();
  }, []);

  const handleDeleteClick = (Id: string, event: React.MouseEvent) => {
  event.stopPropagation();
  setPendingDelete(Id);
  setIsDeleteDialogOpen(true);
};



const confirmDelete = async () => {
  if (!pendingDelete) return;
  setCountdown(5);
  const interval = setInterval(() => {
    setCountdown((prev) => (prev !== null ? prev - 1 : null));
  }, 1000);

  const timeout = setTimeout(async () => {
    clearInterval(interval);
     const data = await classDelete(pendingDelete);
    if (data.success) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message);
    }

    setPendingDelete(null);
    setCountdown(null);
    setIsDeleteDialogOpen(false);
  }, 5000);

  setDeleteTimeout(timeout);
};

  const undoDelete = () => {
    if (deleteTimeout) clearTimeout(deleteTimeout);
    setPendingDelete(null);
    setCountdown(null);
    setIsDeleteDialogOpen(false);
  };

  const columnDefs = useMemo(() => {
    return [
      {
        headerName: "Roll No.",
        valueGetter: (params) => params.node.rowIndex + 1,
        width: 90,
        pinned: "left",
        sortable: false,
        filter: false,
      },
      ...columns.map((col) => ({
        headerName: col.header,
        field: col.accessor,
        cellClass: col.className,
      })),
      {
        headerName: "Delete",
        field: "actions",
        cellRenderer: (params: any) => (
          <button
            onClick={(e) => handleDeleteClick(params.data.id, e)}
            className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
          >
            Del
          </button>
        ),
        width: 100,
      },
    ];
  }, [columns]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
  }), []);

  const handleRowClick = (event: any) => {
    if (event.event.target.tagName === "BUTTON") return;
    router.push(`/list/${list}/${event.data.id}`);
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
        onFilterChanged={updateRollNumbers}
        onSortChanged={updateRollNumbers}
      />

      {isDeleteDialogOpen && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>Are you sure you want to delete this record?</DialogHeader>
            <DialogFooter className="flex justify-between">
              <Button onClick={undoDelete} variant="secondary">Cancel</Button>
              <Button onClick={confirmDelete} variant="destructive">Confirm Delete</Button>
            </DialogFooter>
            {countdown !== null && (
              <div className="text-center mt-2 flex">
                <span className="text-red-500 font-bold">{countdown}s remaining...</span>
                <Button onClick={undoDelete} className="mt-2">Undo</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AGgrid;