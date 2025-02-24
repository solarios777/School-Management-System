"use client";

import { useEffect, useState } from "react";
import { calculateRank } from "@/app/_services/GlobalApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AcademicYear = string;
type Semester = 1 | 2;

const CalculateRank: React.FC = () => {
  const [year, setYear] = useState<string | null>(null);
  const [semester, setSemester] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleCalculateRank = async () => {
    if (!year || !semester) return;
    setLoading(true);
    try {
      await calculateRank(year, semester);
      toast.success("Ranking calculation successful!");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to calculate ranking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">
        Calculate Ranking
      </h3>

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
        disabled={!year || !semester || loading}
      >
        {loading ? "Calculating..." : "Calculate"}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>This action will calculate results for {year}, Semester {semester}.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCalculateRank} disabled={loading}>
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalculateRank;
