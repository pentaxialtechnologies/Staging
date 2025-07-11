import { Jobs } from "@/models/ContractJob";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";

export async function GET(){

try{
    await dbConnect()
const job = await Jobs.find({status:'approved'}).sort({createdAt: -1})
if(!job){
    return NextResponse.json({message:'Job Not Found'})
}
    return NextResponse.json(job)

}
catch(error){
    return NextResponse.json({message:'Server Error',error})
}
}