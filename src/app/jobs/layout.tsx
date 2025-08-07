import type {Metadata} from 'next'
import React from 'react';
export const metadata : Metadata={
    title:'Job Page',
    description:'Find a Good Job',
    icons:{
        icon:'/icons/job-icon.ico'
    }
}

export default function JobLayout({children}:{children: React.ReactNode}){
return (
    <div>
        {children}
    </div>
)
}