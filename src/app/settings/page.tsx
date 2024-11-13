"use client"
import React from 'react'


import { signOut } from 'next-auth/react'
import { useCurrentUser } from '../../../hooks/use-currentUser'



const Page = () => {
  const user=useCurrentUser()
  const onClick=()=>{
    signOut()
  }
  return (
    <div>
      {user?.role} 
     
        <button type="submit" onClick={onClick}>sign out</button>
     
    </div>
  )
}

export default Page
