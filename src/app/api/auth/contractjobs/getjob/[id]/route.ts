import { NextRequest, NextResponse } from "next/server";
import { Jobs } from "@/models/ContractJob";
import dbConnect from "@/lib/Mongodb";

export async function GET(req:NextRequest,{params}:{params :{id:string}}){
    try{
        await dbConnect()
    const id = params.id;
    
    const job = await Jobs.findById(id).populate('postedBy').lean()

    if(!job)
    {
        return NextResponse.json({message:'Job not found'},{status: 404})
    }
        return NextResponse.json({message:'Jobs',job},{status: 200})
    }
    catch(error){
        return NextResponse.json({message:'Internal Server Error'},{status: 500})
    }
}