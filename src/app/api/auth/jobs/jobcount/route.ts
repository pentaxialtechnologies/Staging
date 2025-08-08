import { Jobs } from "@/models/ContractJob";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";

export async function GET(){
    try{
    await dbConnect();

    const jobCounts = await Jobs.aggregate([
        {
            $group:{
                _id:'postedBy',
                totalJobs: {$sum: 1}
            }
        }
    ])

    const CountJobs = Object.fromEntries(jobCounts.map(j => [j._id.toString(),j.totalJobs]))
    
        return NextResponse.json({message:'Fetched Job counts',CountJobs},{status:200})
}
    catch(error){
        return NextResponse.json({message:'Server Error',error},{status:500})
    }
}