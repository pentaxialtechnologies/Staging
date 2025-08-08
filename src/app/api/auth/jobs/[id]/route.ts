// import { Jobs } from "@/models/ContractJob";
// import dbConnect from '@/lib/Mongodb';
// import { NextResponse } from "next/server";

// type RouteContexts = { params: Promise<{ id: string }> };

// export async function GET(req:Request,context:RouteContexts){

//     try{
//       const {id} = await context.params; 
//       await dbConnect()
//     const job = await Jobs.findById(id).lean().populate('postedBy', 'firstname email id lastActiveAt');
//     if (!job) {
//       return NextResponse.json({ message: "Job not found" }, { status: 404 });
//     }
//     return NextResponse.json({data:job});
//     }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     catch (error: any) {
//     return NextResponse.json({ message: "Error fetching job", error: error.message }, { status: 500 });
//   }
// }

import { Jobs } from "@/models/ContractJob";
import dbConnect from '@/lib/Mongodb';
import { NextResponse } from "next/server";

type RouteContexts = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContexts) {
  try {
    const { id } = await context.params;
    await dbConnect();

    // Step 1: Find the job and populate postedBy
    const job = await Jobs.findById(id)
      .lean()
      .populate('postedBy', 'firstname email _id lastActiveAt');

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Step 2: Get the employer ID
    const employerId = job.postedBy._id;

    // Step 3: Count jobs by the same employer
    const jobCount = await Jobs.countDocuments({ postedBy: employerId, isDeleted: false });

    // Step 4: Return job + jobCount in response
    return NextResponse.json({
      data: {
        ...job,
        employerJobCount: jobCount,
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching job", error: error.message },
      { status: 500 }
    );
  }
}
