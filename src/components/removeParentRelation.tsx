"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { fetchStudentsByParentId, removeParentRelationship } from "@/app/_services/GlobalApi";

export const RemoveParentRelationshipDialog = ({ parentId }: { parentId: string }) => {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<{ id: string; name: string; username: string,surname:string }[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const data = await fetchStudentsByParentId(parentId);
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    }
  };

  const handleRemoveRelationship = async () => {
  if (!selectedStudentId) {
    alert('Please select a student');
    return;
  }

  setLoading(true);
  try {
    await removeParentRelationship(selectedStudentId, parentId); // Pass studentId and parentId
    alert('Relationship removed successfully');
    setOpen(false);
  } catch (error) {
    console.error('Error removing relationship:', error);
    alert('Failed to remove relationship');
  } finally {
    setLoading(false);
  } 
};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={fetchStudents}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Remove Relationship
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Remove Parent Relationship</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="student" className="block text-sm font-medium text-gray-700">
              Select Student
            </Label>
            <Select onValueChange={(value) => setSelectedStudentId(value)}>
              <SelectTrigger className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} {student.surname}({student.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleRemoveRelationship}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Removing...' : 'Remove Relationship'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};