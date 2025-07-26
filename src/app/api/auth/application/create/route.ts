import { Applications } from "@/models/Application";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        await dbConnect()
const {
    jobId,applicantId,resumeUrl,coverLetter,status,appliedAt} = await req.json()
   
const newApplication = new Applications({
    jobId,applicantId,resumeUrl,coverLetter,status,appliedAt
})

await newApplication.save();
        return NextResponse.json({message:'Application Created',newApplication},{status:200})

}
    catch(error){
        return NextResponse.json({message:'Internel Server Error',error},{status:501})
    }
}