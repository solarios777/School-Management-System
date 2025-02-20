"use client";
// View Results Page
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import AGGridReact, { AgGridReact } from 'ag-grid-react';

const ViewResultsComponent = () => {
  const [grade, setGrade] = useState('');
  const [classroom, setClassroom] = useState('');
  const [examType, setExamType] = useState('');

  const handleFetchResults = () => {
    // Fetch results logic here
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">View Results</h1>

      <div className="flex space-x-4 mt-4">
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

        <Select onValueChange={(value) => setExamType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Exam Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="midterm">Mid-Term</SelectItem>
            <SelectItem value="final">Final Exam</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleFetchResults}>Fetch Results</Button>
      </div>

      <div className="mt-4">
        <AgGridReact rowData={[]} columnDefs={[]} />
      </div>
    </div>
  );
};

const ViewResults = dynamic(() => Promise.resolve(ViewResultsComponent), { ssr: false });
export default ViewResults;
