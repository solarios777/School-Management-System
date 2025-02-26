"use client";
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { fetchSchedules, updateSchedule, deleteSchedule } from "@/app/_services/scheduleRelated";

interface Schedule {
  id: string;
  teacherName: string;
  grade: string;
  className: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
}

export default function ScheduleEditor() {
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [editData, setEditData] = useState<Schedule | null>(null);

  useEffect(() => {
    fetchSchedules().then(setScheduleData);
  }, []);

  const columnDefs = [
    { field: "teacherName", headerName: "Teacher", sortable: true },
    { field: "grade", headerName: "Grade", sortable: true },
    { field: "className", headerName: "Class", sortable: true },
    { field: "subject", headerName: "Subject", sortable: true },
    { field: "day", headerName: "Day", sortable: true },
    { field: "startTime", headerName: "Start Time" },
    { field: "endTime", headerName: "End Time" },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setEditData(params.data)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(params.data.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    await deleteSchedule(id);
    setScheduleData(scheduleData.filter((s) => s.id !== id));
  };

  const handleUpdate = async () => {
    if (editData) {
      await updateSchedule(editData.id, editData);
      setScheduleData(scheduleData.map((s) => (s.id === editData.id ? editData : s)));
      setEditData(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Schedule Editor</h2>
      <div className="ag-theme-alpine w-full h-[500px]">
        <AgGridReact rowData={scheduleData} columnDefs={columnDefs} pagination />
      </div>

      {editData && (
        <Dialog open={!!editData} onOpenChange={() => setEditData(null)}>
          <DialogTrigger />
          <DialogContent>
            <h3 className="text-lg font-semibold">Edit Schedule</h3>
            <div className="space-y-3">
              <label className="block">
                Start Time:
                <input
                  type="time"
                  className="border p-2 w-full"
                  value={editData.startTime}
                  onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
                />
              </label>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
