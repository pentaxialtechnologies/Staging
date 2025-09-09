// import { NextResponse } from "next/server";
// import  {Jobs } from '@/models/ContractJob';
// import dbConnect from "@/lib/Mongodb";

// export async function GET(){
// try{
// await dbConnect();
// const jobs = await Jobs.find().sort({createdAt:-1}).lean();

//     return NextResponse.json({jobs},{status:200})
// }
// catch(error){
//     return NextResponse.json({message:'Internal Server error',error},{status:501})
// }

// }

// /app/api/auth/jobs/route.ts

import { NextResponse } from "next/server";
import { Jobs } from '@/models/ContractJob';
import dbConnect from "@/lib/Mongodb";

export async function GET() {
  try {
    await dbConnect();

    const jobs = await Jobs.find()
      .sort({ createdAt: -1 })
      .populate('postedBy') // Populate employer details
      .lean(); // Converts to plain JS objects

    // Build a map to avoid multiple DB queries per employer
    const employerJobCountMap: Record<string, number> = {};

    for (const job of jobs) {
      const employerId = job.postedBy?._id?.toString();

      // If count not already fetched
      if (employerId && employerJobCountMap[employerId] === undefined) {
        const count = await Jobs.countDocuments({ postedBy: employerId });
        employerJobCountMap[employerId] = count;
      }

      // Add job count to each job's employer
      job.jobPostCount  = employerJobCountMap[employerId] || 0;
    }

    return NextResponse.json({ jobs }, { status: 200 });

  } catch (error) {
    console.error("Job Listing Error:", error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}
