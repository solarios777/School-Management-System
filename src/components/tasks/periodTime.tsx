"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, MinusCircle } from "lucide-react";
import { savePeriodTimetable, fetchPeriodTimetable } from "@/app/_services/scheduleRelated";

interface PeriodRow {
  rollNo: number;
  startTime: string;
  endTime: string;
  type: string;
}

const generateDefaultRows = (count: number): PeriodRow[] => {
  return Array.from({ length: count }, (_, index) => ({
    rollNo: index + 1,
    startTime: "",
    endTime: "",
    type: "class",
  }));
};

const PeriodTimeTable: React.FC = () => {
  const [rows, setRows] = useState<PeriodRow[]>([]); 
  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    const loadTimetable = async () => {
      try {
        const data = await fetchPeriodTimetable();
        setRows(data.length > 0 ? adjustRollNumbers(data) : generateDefaultRows(1)); // Ensure at least 3 rows
      } catch (error) {
        console.error("Failed to load timetable:", error);
        setRows(generateDefaultRows(1)); // Show default rows in case of error
      }
    };
    loadTimetable();
  }, []);

  // Helper function to adjust roll numbers sequentially
  const adjustRollNumbers = (rows: PeriodRow[]): PeriodRow[] =>
    rows.map((row, index) => ({ ...row, rollNo: index + 1 }));

  // Function to add a row under the clicked row and adjust roll numbers
  const addRow = (index: number) => {
    const newRow: PeriodRow = {
      rollNo: rows[index].rollNo + 1,
      startTime: "",
      endTime: "",
      type: "class",
    };

    const updatedRows = [
      ...rows.slice(0, index + 1),
      newRow,
      ...rows.slice(index + 1).map(row => ({ ...row, rollNo: row.rollNo + 1 })),
    ];

    setRows(updatedRows);
  };

  // Function to remove a row and adjust roll numbers
  const removeRow = (index: number) => {
    if (rows.length > 1) {
      const updatedRows = [
        ...rows.slice(0, index),
        ...rows.slice(index + 1).map(row => ({ ...row, rollNo: row.rollNo - 1 })),
      ];
      setRows(updatedRows);
    }
  };

  // Function to update a row value
  const updateRow = (index: number, field: keyof PeriodRow, value: string) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      await savePeriodTimetable(rows);
      alert("Timetable saved successfully!");
      setShowDialog(false);
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("Failed to save timetable. Please try again.");
    }
  };

  return (
    <>
      <Button onClick={() => setShowDialog(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Set Period Timetable
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="text-lg font-bold">Set Time Table of Each Period</DialogHeader>
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4 font-bold">
                <span>Roll No.</span>
                <span>Start Time</span>
                <span>End Time</span>
                <span>Type</span>
                <span>Actions</span>
              </div>

              {rows.map((row, index) => (
                <div key={row.rollNo} className="grid grid-cols-5 gap-4 items-center">
                  <span>{row.rollNo}</span>
                  <label className="block">
                    <input
                      type="time"
                      className="border p-2 w-full"
                      value={row.startTime}
                      onChange={(e) => updateRow(index, "startTime", e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <input
                      type="time"
                      className="border p-2 w-full"
                      value={row.endTime}
                      onChange={(e) => updateRow(index, "endTime", e.target.value)}
                    />
                  </label>
                  <Select value={row.type} onValueChange={(value) => updateRow(index, "type", value)}>
                    <SelectTrigger>
                      <SelectValue>{row.type.charAt(0).toUpperCase() + row.type.slice(1)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2">
                    <MinusCircle className="cursor-pointer text-red-600" onClick={() => removeRow(index)} />
                    <PlusCircle className="cursor-pointer text-blue-600" onClick={() => addRow(index)} />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PeriodTimeTable;
