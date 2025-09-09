import dbConnect from "@/lib/Mongodb";
import { Proposals } from "@/models/proposal/Proposal";
import { NextResponse } from "next/server";


export async function GET(){
    try{
        await dbConnect()
    const proposals = await Proposals.find().populate('ProviderId','company_name email')
    
    if(!proposals || proposals.length === 0){
        return NextResponse.json({message:'No Proposal found'},{status:404})
    }
        return NextResponse.json({message:'Proposal found',data:proposals},{status:200})
    }
    catch(error:any){
        console.error('Proposal API Error',error);
        return NextResponse.json({message:'Server Error',error:error.message,stack:error.stack},{ status: 500 })
    }
}