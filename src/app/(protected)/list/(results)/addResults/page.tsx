"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import dynamic from 'next/dynamic';

const AddResultsComponent = () => {
  const [grade, setGrade] = useState('');
  const [classroom, setClassroom] = useState('');
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    if (grade && classroom) {
      // Fetch students based on grade and class
      // Mock data for now
      setStudents([
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' }
      ]);
    }
  }, [grade, classroom]);

  const handleMarksChange = (studentId, value) => {
    setMarks({ ...marks, [studentId]: value });
  };

  const handleSubmit = () => {
    console.log('Submitting Results:', { grade, classroom, subject, examType, marks });
    // Submit logic here
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add Results</h1>

      <div className="flex space-x-4">
        <Select onValueChange={(value) => setGrade(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Grade 1</SelectItem>
            <SelectItem value="2">Grade 2</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setClassroom(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Class A</SelectItem>
            <SelectItem value="B">Class B</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSubject(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="math">Math</SelectItem>
            <SelectItem value="science">Science</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setExamType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Exam Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="midterm">Mid-Term</SelectItem>
            <SelectItem value="final">Final Exam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="mt-4">
        <CardContent>
          <h2 className="text-xl font-semibold">Enter Marks</h2>
          <div className="space-y-2 mt-2">
            {students.map((student) => (
              <div key={student.id} className="flex justify-between items-center">
                <span>{student.name}</span>
                <input
                  type="number"
                  className="border p-1 rounded"
                  placeholder="Marks"
                  value={marks[student.id] || ''}
                  onChange={(e) => handleMarksChange(student.id, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button className="mt-4" onClick={handleSubmit}>Submit Results</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const AddResults = dynamic(() => Promise.resolve(AddResultsComponent), { ssr: false });
export default AddResults;
