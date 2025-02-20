'use client';

import { useEffect, useState } from 'react';
import ResultDashboard from '@/components/resultComponents/resultDashboard';
import { fetchUserSelections } from '@/app/_services/GlobalApi';

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
      <h2 className="text-2xl font-bold">Result Dashboard</h2>
      <div>
        <ResultDashboard grades={grades} classes={sections} subjects={subjects} />
      </div>
    </div>
  );
};

export default Page;
