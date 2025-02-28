"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { generateSchedule } from "@/app/_services/scheduleRelated"; // Import the API function

function ScheduleTable() {
  const [selectedYear, setSelectedYear] = useState("");
  const [maxWorkload, setMaxWorkload] = useState("");
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generate academic years dynamically
  useEffect(() => {
    const generateAcademicYears = () => {
      const currentYear = new Date().getFullYear();
      const startYear = new Date().getMonth() + 1 < 9 ? currentYear - 1 : currentYear;
      return Array.from(
        { length: 5 },
        (_, i) => `${startYear + i - 2}/${(startYear + i - 1) % 100}`
      );
    };

    setAcademicYears(generateAcademicYears());
  }, []);

  const handleConfirm = async () => {
    if (!selectedYear || !maxWorkload) {
      alert("Please select a year and enter max workload.");
      return;
    }

    setLoading(true);
    try {
      const response = await generateSchedule(selectedYear, Number(maxWorkload));
      alert(response.message); // Show success message
    } catch (error) {
      alert("Failed to generate schedule.");
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Generate Schedule</h2>
      <div className="flex justify-between gap-4">
        {/* Year Selection Dropdown */}
        <div className="mb-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="" disabled>Select Academic Year</option>
            {academicYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Max Teacher Workload Input */}
        <div className="mb-4">
          <input
            type="number"
            value={maxWorkload}
            onChange={(e) => setMaxWorkload(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter max workload"
          />
        </div>
      </div>

      {/* Generate Schedule Button with Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Generate Schedule"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Schedule Generation</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to generate the schedule with:
            <br />
            <strong>Year:</strong> {selectedYear || "Not selected"} <br />
            <strong>Max Workload:</strong> {maxWorkload || "Not entered"}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ScheduleTable;
