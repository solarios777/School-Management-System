import GradeSelection from '@/components/GradeSelection'
import MonthSelection from '@/components/MonthSelection'
import React from 'react'

const page = () => {
  return (
    <div className='px-10 py-5'>
      <h2 className='text-2xl font-bold'>Attendance</h2>
      {/* search options */}
      <div><MonthSelection/></div>
      <div><GradeSelection/></div>
      
    </div>
  )
}

export default page
