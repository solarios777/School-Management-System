"use client";

import { useEffect, useState } from "react";
import { releaseResults, checkReleaseStatus } from "@/app/_services/GlobalApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AcademicYear = string;
type Semester = 1 | 2;

const ReleaseResults: React.FC = () => {
  const [year, setYear] = useState<string | null>(null);
  const [semester, setSemester] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isReleased, setIsReleased] = useState<boolean | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
    const fetchReleaseStatus = async () => {
      if (!year || !semester) return;
      try {
        const status = await checkReleaseStatus(year, semester);
        setIsReleased(status.isReleased);
        console.log(status.isReleased);
        
      } catch (error) {
        console.error("Failed to fetch release status", error);
      }
    };

    fetchReleaseStatus();
  }, [year, semester]);

  const handleReleaseResults = async () => {
    setLoading(true);
    setDialogOpen(false);

    try {
      const data = await releaseResults(year!, semester!);
      toast.success(data.message || "Results released successfully.");
      setIsReleased(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to release results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Release Results</h3>

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

      <Button
        onClick={() => setDialogOpen(true)}
        disabled={!year || !semester || isReleased || loading}
      >
        {isReleased ? "Released" : loading ? "Releasing..." : "Release"}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>This action will release results for {year}, Semester {semester}.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReleaseResults} disabled={loading}>
              {loading ? "Releasing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReleaseResults;
