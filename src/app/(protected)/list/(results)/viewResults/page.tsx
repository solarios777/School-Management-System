'use client';

import { useEffect, useState } from 'react';
import ResultDashboard from '@/components/resultComponents/resultDashboard';
import { fetchUserSelections } from '@/app/_services/GlobalApi';
import ViewResults from '@/components/resultComponents/viewResults';

const Page = () => {
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const data = await fetchUserSelections();
        setGrades(data.grades);
        setSections(data.sections);
        setSubjects(data.subjects);
      } catch (error) {
        console.error('Error loading selections:', error);
      }
    };

    fetchSelections();
  }, []);

  return (
    <div className="">
      <h2 className="text-2xl font-bold">View Result</h2>
      <div>
        <ViewResults grades={grades} classes={sections}  />
      </div>
    </div>
  );
};

export default Page;
