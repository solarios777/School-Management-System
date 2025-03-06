"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchStudentsforParent, updateParentRelationship } from "@/app/_services/GlobalApi";
import { useRouter } from "next/navigation";


const schema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  studentUsername: z.string().min(1, "Student username is required"),
});

type FormData = z.infer<typeof schema>;

export const CreateStudentParentRelationshipDialog = ({ parentId }: { parentId: string }) => {
 
  
  const [open, setOpen] = useState(false);
  const [searchQueryByName, setSearchQueryByName] = useState("");
  const [searchQueryByUsername, setSearchQueryByUsername] = useState("");
  const [studentsByName, setStudentsByName] = useState<{ id: string; name: string; username: string }[]>([]);
  const [studentsByUsername, setStudentsByUsername] = useState<{ id: string; name: string; username: string }[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string; username: string } | null>(null);
 
  const router=useRouter()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const studentName = watch("studentName");
  const studentUsername = watch("studentUsername");

  const handleSearchByName = async (query: string) => {
    if (query.length >= 2) {
      const data = await fetchStudentsforParent(query, "name");
      setStudentsByName(data);
    } else {
      setStudentsByName([]); // Clear the dropdown if the query is less than 3 characters
    }
  };

  const handleSearchByUsername = async (query: string) => {
    if (query.length >= 2) {
      const data = await fetchStudentsforParent(query, "username");
      setStudentsByUsername(data);
    } else {
      setStudentsByUsername([]); // Clear the dropdown if the query is less than 3 characters
    }
  };

  const handleStudentSelect = (student: { id: string; name: string; username: string }) => {
    setSelectedStudent(student);
    setValue("studentName", student.name);
    setValue("studentUsername", student.username);
    setSearchQueryByName(student.name);
    setSearchQueryByUsername(student.username);
    setStudentsByName([]);
    setStudentsByUsername([]);
  };

const onSubmit = async (data: FormData) => {
  try {
    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    // Call the backend API to create the parent relationship
    const response = await updateParentRelationship(
      selectedStudent.id, // Pass studentId
      parentId // Pass parentId
    );
    alert("Relationship created successfully!");
    setOpen(false);
    router.refresh()
  } catch (error) {
    console.error("Error creating relationship:", error);
    alert("Failed to create relationship");
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create Relationship</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Student-Parent Relationship</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
              Student Name
            </Label>
            <Input
              id="studentName"
              value={studentName}
              onChange={(e) => {
                setValue("studentName", e.target.value);
                setSearchQueryByName(e.target.value);
                handleSearchByName(e.target.value);
              }}
              placeholder="Search for a student by name..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {studentsByName.length > 0 && (
              <ul className="mt-2 border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {studentsByName.map((student) => (
                  <li
                    key={student.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    onClick={() => handleStudentSelect(student)}
                  >
                    <span className="font-medium">{student.name} {student.username}</span> ({student.username})
                  </li>
                ))}
              </ul>
            )}
            {errors.studentName && (
              <p className="mt-1 text-sm text-red-600">{errors.studentName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="studentUsername" className="block text-sm font-medium text-gray-700">
              Student Username
            </Label>
            <Input
              id="studentUsername"
              value={studentUsername}
              onChange={(e) => {
                setValue("studentUsername", e.target.value);
                setSearchQueryByUsername(e.target.value);
                handleSearchByUsername(e.target.value);
              }}
              placeholder="Search for a student by username..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {studentsByUsername.length > 0 && (
              <ul className="mt-2 border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {studentsByUsername.map((student) => (
                  <li
                    key={student.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    onClick={() => handleStudentSelect(student)}
                  >
                    <span className="font-medium">{student.username}</span> ({student.name})
                  </li>
                ))}
              </ul>
            )}
            {errors.studentUsername && (
              <p className="mt-1 text-sm text-red-600">{errors.studentUsername.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Create Relationship
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};