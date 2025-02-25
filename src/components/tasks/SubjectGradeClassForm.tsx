"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";

type Subject = { id: string; name: string };
type Grade = { id: string; level: number };
type Class = { id: string; name: string };

interface Props {
  subjects: Subject[];
  grades: Grade[];
  classes: Class[];
}

const SubjectGradeClassForm: React.FC<Props> = ({ subjects, grades, classes }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<{ [key: string]: string[] }>({});
  const [selectAllGrades, setSelectAllGrades] = useState(false);
  const [selectAllSections, setSelectAllSections] = useState<{ [key: string]: boolean }>({});

  // Handle Grade Selection (Sort recent selections on top)
  const handleGradeSelection = (gradeId: string) => {
    setSelectedGrades((prev) => {
      const updated = prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [gradeId, ...prev];
      return updated;
    });

    // Reset sections if grade is deselected
    if (selectedGrades.includes(gradeId)) {
      setSelectedSections((prev) => {
        const updated = { ...prev };
        delete updated[gradeId];
        return updated;
      });
    }
  };

  // Handle "Select All Grades"
  const toggleSelectAllGrades = () => {
    if (selectAllGrades) {
      setSelectedGrades([]);
      setSelectedSections({});
    } else {
      const allGradeIds = grades.map((grade) => grade.id);
      setSelectedGrades(allGradeIds);

      const allSections = allGradeIds.reduce((acc, gradeId) => {
        acc[gradeId] = classes.map((cls) => cls.id);
        return acc;
      }, {} as { [key: string]: string[] });

      setSelectedSections(allSections);
    }
    setSelectAllGrades(!selectAllGrades);
  };

  // Handle Section Selection
  const handleSectionSelection = (gradeId: string, sectionId: string) => {
    setSelectedSections((prev) => ({
      ...prev,
      [gradeId]: prev[gradeId]?.includes(sectionId)
        ? prev[gradeId].filter((id) => id !== sectionId)
        : [...(prev[gradeId] || []), sectionId],
    }));
  };

  // Handle "Select All Sections" for a grade
  const toggleSelectAllSections = (gradeId: string) => {
    setSelectAllSections((prev) => ({
      ...prev,
      [gradeId]: !prev[gradeId],
    }));

    setSelectedSections((prev) => ({
      ...prev,
      [gradeId]: !selectAllSections[gradeId] ? classes.map((cls) => cls.id) : [],
    }));
  };

  const handleSubmit = () => {
    console.log("Selected Subject:", selectedSubject);
    console.log("Selected Grades & Sections:", selectedSections);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Assign Subject to Grades & Sections
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-lg font-bold">Assign Subject</DialogHeader>
        <div className="space-y-4">
          {/* Subject Selection */}
          <Select onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Grade Selection */}
          <Select onValueChange={handleGradeSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Select Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" onClick={toggleSelectAllGrades}>
                Select All Grades
              </SelectItem>
              {selectedGrades
                .map((gradeId) => grades.find((g) => g.id === gradeId)) // Show selected first
                .concat(grades.filter((g) => !selectedGrades.includes(g.id))) // Then others
                .map((grade) =>
                  grade ? (
                    <SelectItem key={grade.id} value={grade.id}>
                      Grade {grade.level}
                    </SelectItem>
                  ) : null
                )}
            </SelectContent>
          </Select>

          {/* Grade & Section Selection */}
        <ScrollArea className="h-72 overflow-y-auto border rounded-md p-4">
  <div className="border p-5 rounded-lg bg-gray-50">
    <p className="font-semibold mb-4">Select Sections</p>
    {selectedGrades.map((gradeId) => {
      const grade = grades.find((g) => g.id === gradeId);
      return (
        <div key={gradeId} className="mb-5">
          {/* Grade Label */}
          <div className="flex items-center space-x-3">
            <label className="font-medium">Grade {grade?.level}</label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleSelectAllSections(gradeId)}
            >
              {selectAllSections[gradeId] ? "Deselect All Sections" : "Select All Sections"}
            </Button>
          </div>

          {/* Section Selection */}
          <div className="ml-6 grid grid-cols-4 gap-4 mt-4">
            {classes.map((cls) => (
              <div key={cls.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedSections[gradeId]?.includes(cls.id)}
                  onCheckedChange={() => handleSectionSelection(gradeId, cls.id)}
                />
                <label className="text-sm">{cls.name}</label>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
</ScrollArea>


          {/* Submit Button */}
          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectGradeClassForm;
