"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { assignSubjects } from "@/app/_services/scheduleRelated";
import { set } from "date-fns";


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
  const [selectAllSections, setSelectAllSections] = useState<{ [key: string]: boolean }>({});
  const [selectAllSectionsAllGrades, setSelectAllSectionsAllGrades] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Sorting data
  const sortedGrades = [...grades].sort((a, b) => a.level - b.level);
  const sortedClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));
  const sortedSubjects = [...subjects].sort((a, b) => a.name.localeCompare(b.name));

  const handleGradeSelection = (gradeId: string) => {
    setSelectedGrades((prev) => {
      const updated = prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [gradeId, ...prev];
      return updated;
    });
  };

  const handleSectionSelection = (gradeId: string, sectionId: string) => {
    setSelectedSections((prev) => ({
      ...prev,
      [gradeId]: prev[gradeId]?.includes(sectionId)
        ? prev[gradeId].filter((id) => id !== sectionId)
        : [...(prev[gradeId] || []), sectionId],
    }));
  };

  const toggleSelectAllSections = (gradeId: string) => {
    setSelectAllSections((prev) => ({
      ...prev,
      [gradeId]: !prev[gradeId],
    }));

    setSelectedSections((prev) => ({
      ...prev,
      [gradeId]: !selectAllSections[gradeId] ? sortedClasses.map((cls) => cls.id) : [],
    }));
  };

  const toggleSelectAllSectionsAllGrades = () => {
    setSelectAllSectionsAllGrades((prev) => !prev);

    const allSections = selectAllSectionsAllGrades
      ? {}
      : sortedGrades.reduce((acc, grade) => {
          acc[grade.id] = sortedClasses.map((cls) => cls.id);
          return acc;
        }, {} as { [key: string]: string[] });

    setSelectedSections(allSections);
  };

 const handleSubmit = async () => {
  if (!selectedSubject || Object.keys(selectedSections).length === 0) {
    alert("Please select a subject, grades, and sections.");
    return;
  }

  try {
    await assignSubjects(selectedSubject, selectedSections);
    alert("Subject assigned successfully!");
    setShowDialog(false);
  } catch (error) {
    alert("Failed to assign subject. Please try again.");
  }
};

  const handleOpen = () => {
    setShowDialog(true);
  }

  return (
    <>
    <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={handleOpen}>
          Assign Subject to Grades & Sections
        </Button>
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader className="text-lg font-bold">Assign Subject</DialogHeader>
        <div className="space-y-4">
          <Select onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Subject" />
            </SelectTrigger>
            <SelectContent>
              {sortedSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleGradeSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Select Grades" />
            </SelectTrigger>
            <SelectContent>
              {sortedGrades.map((grade) => (
                <SelectItem key={grade.id} value={grade.id}>
                  Grade {grade.level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={toggleSelectAllSectionsAllGrades} className="mb-2">
            {selectAllSectionsAllGrades ? "Deselect All Sections for All Grades" : "Select All Sections for All Grades"}
          </Button>

          <ScrollArea className="h-72 overflow-y-auto border rounded-md p-4">
            <div className="border p-5 rounded-lg bg-gray-50">
              <p className="font-semibold mb-4">Select Sections</p>
              {selectedGrades.map((gradeId) => {
                const grade = sortedGrades.find((g) => g.id === gradeId);
                return (
                  <div key={gradeId} className="mb-5">
                    <div className="flex items-center space-x-3">
                      <label className="font-medium">Grade {grade?.level}</label>
                      <Button size="sm" variant="outline" onClick={() => toggleSelectAllSections(gradeId)}>
                        {selectAllSections[gradeId] ? "Deselect All Sections" : "Select All Sections"}
                      </Button>
                    </div>

                    <div className="ml-6 grid grid-cols-4 gap-4 mt-4">
                      {sortedClasses.map((cls) => (
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

          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default SubjectGradeClassForm;
