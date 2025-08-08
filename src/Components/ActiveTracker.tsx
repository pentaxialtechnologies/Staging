'use client'

import { useEffect } from "react"
import React from 'react'

const ActiveTracker = () => {

    useEffect(()=>{
    const UpdateLastActive = async()=>{
        try{
       const res= await fetch('/api/auth/employer/active',{method:'POST'})
       console.log(res,'res from active');
       
        }
        catch(error){
            console.error('Error updating active status:',error);
        }
    }
    UpdateLastActive()
    },[])
  return null
}

export default ActiveTracker