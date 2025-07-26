import { NextResponse } from "next/server";
import  {Jobs } from '@/models/ContractJob';
import dbConnect from "@/lib/Mongodb";

export async function GET(){
try{
await dbConnect();
const jobs = await Jobs.find().sort({createdAt:-1}).lean();

    return NextResponse.json({jobs},{status:200})
}
catch(error){
    return NextResponse.json({message:'Internal Server error',error},{status:501})
}

}