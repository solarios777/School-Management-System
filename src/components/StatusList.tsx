import React from 'react'
import StatusCard from './StatusCard'
import { GraduationCap, LucideTrendingDown, TrendingDown, TrendingUp } from 'lucide-react'

const StatusList = ({ attendanceData }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <StatusCard icon={<GraduationCap />} title="Total Students" value={attendanceData.totalStudents} />
      <StatusCard icon={<TrendingUp />} title="Total Present" value={`${((attendanceData.present / attendanceData.totalStudents) * 100 || 0).toFixed(2)}%`} />
      <StatusCard icon={<TrendingDown />} title="Total Absent" value={`${((attendanceData.absent / attendanceData.totalStudents) * 100 || 0).toFixed(2)}%`} />
      <StatusCard icon={<LucideTrendingDown />} title="Total Late" value={`${((attendanceData.late / attendanceData.totalStudents) * 100 || 0).toFixed(2)}%`}  />
    </div>
  );
}


export default StatusList
