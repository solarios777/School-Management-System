"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";

// Types
type Subject = { id: string; name: string };
type Grade = { id: string; level: number };
type Class = { id: string; name: string };

interface Props {
  subjects: Subject[];
  grades: Grade[];
  classes: Class[];
}

const SubjectQuotaConfig: React.FC<Props> = ({ subjects, grades, classes }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<{ [key: string]: string[] }>({});
  const [selectAllSections, setSelectAllSections] = useState<{ [key: string]: boolean }>({});
  const [selectAllSectionsAllGrades, setSelectAllSectionsAllGrades] = useState(false);
  const [weeklyQuota, setWeeklyQuota] = useState(1);
  const [showDialog, setShowDialog] = useState(false);

  // Sorting
  const sortedGrades = [...grades].sort((a, b) => a.level - b.level);
  const sortedClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));
  const sortedSubjects = [...subjects].sort((a, b) => a.name.localeCompare(b.name));

  // Handlers
  const handleSubjectSelection = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

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

  

  const handleSubmit = () => {
    console.log({
      selectedSubjects,
      selectedGrades,
      selectedSections,
      weeklyQuota,
    });
  };

  return (
    <>
      <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
           onClick={() => setShowDialog(true)}>Configure Subject Quota</Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader className="text-lg font-bold">Subject Quota Configuration</DialogHeader>
          <div className="space-y-4">
            <div>
  <p className="text-sm font-medium mb-1">Select Subjects:</p>
<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select Subjects" />
  </SelectTrigger>
  <SelectContent>
            <ScrollArea className="h-72 overflow-y-auto border rounded-md p-4">
      {sortedSubjects.map((subject) => (
        <div
          key={subject.id}
          className="flex items-center space-x-2 p-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault(); // Prevents dropdown from closing
            handleSubjectSelection(subject.id);
          }}
        >
          <Checkbox checked={selectedSubjects.includes(subject.id)} />
          <span>{subject.name}</span>
        </div>
      ))}
    </ScrollArea>
  </SelectContent>
</Select>


  <div className="mt-2 text-sm">
    Selected Subjects:<strong>
    {selectedSubjects.map((id) => subjects.find((s) => s.id === id)?.name).join(", ") || "None"}</strong>
  </div>
</div>


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

            <input
              type="number"
              min="1"
              value={weeklyQuota}
              onChange={(e) => setWeeklyQuota(Number(e.target.value))}
              className="border rounded-md p-2 w-full"
              placeholder="Enter weekly quota"
            />
<Button onClick={handleSubmit} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubjectQuotaConfig;
