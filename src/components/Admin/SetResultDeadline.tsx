"use client";

import { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setResultDeadline, getResultDeadline, getNearestDeadline } from "@/app/_services/GlobalApi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "../ui/card";

type AcademicYear = string;
type Semester = 1 | 2;

const SetResultDeadline: React.FC = () => {
  const [semester, setSemester] = useState<Semester>(1);
  const [deadline, setDeadline] = useState<string>("");
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [year, setYear] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [nearestDeadline, setNearestDeadline] = useState<string | null>(null);

  useEffect(() => {
    const generateAcademicYears = (): AcademicYear[] => {
      const currentYear = new Date().getFullYear();
      const startYear = new Date().getMonth() + 1 < 9 ? currentYear - 1 : currentYear;
      return Array.from(
        { length: 5 },
        (_, i) => `${startYear + i - 2}/${(startYear + i - 1) % 100}`
      );
    };
    setAcademicYears(generateAcademicYears());
  }, []);

  useEffect(() => {
    fetchNearestDeadline(); // Fetch nearest deadline on mount
  }, []);

  const fetchNearestDeadline = async () => {
    try {
      const response = await getNearestDeadline();
      if (response?.deadline) {
        setNearestDeadline(new Date(response.deadline).toLocaleString());
      } else {
        setNearestDeadline("No upcoming deadlines");
      }
    } catch (error) {
      setNearestDeadline("Error fetching deadline");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!year || !semester || !deadline) {
    toast.error("Please select all fields.");
    return;
  }
  try {
    setLoading(true);
    await setResultDeadline(year, semester, deadline);
    toast.success("Deadline set successfully!");
    
    fetchNearestDeadline(); // 🔄 Refresh nearest deadline after setting a new one
  } catch (error) {
    toast.error("Failed to set deadline.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Set Result Deadline</h2>

      <div className="mb-4 p-3 bg-red-200 text-yellow-800 rounded-md">
        <strong>Upcoming Deadline:</strong> {nearestDeadline || "Loading..."}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="mb-6">
          <CardContent className="grid grid-cols-2 gap-4">
            <Select onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setSemester(Number(value) as Semester)}>
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sem-I</SelectItem>
                <SelectItem value="2">Sem-II</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div>
          <label className="block text-sm font-medium">Deadline</label>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Setting..." : "Set Deadline"}
        </Button>
      </form>
    </div>
  );
};

export default SetResultDeadline;
