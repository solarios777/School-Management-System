import React from 'react'

const StatusCard = ({icon,title,value}) => {
  return (
    <div className='flex items-center gap-5 bg-sky-200 rounded-lg shadow p-7'>
      <div className='w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary'>{icon}</div>
      <div>
        <h2 className='font-bold '>{title}</h2>
        <h2 className='text-lg'>{value}</h2>
      </div>
    </div>
  )
}

export default StatusCard
