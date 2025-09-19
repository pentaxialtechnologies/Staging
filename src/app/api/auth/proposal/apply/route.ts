import { authOptions } from "@/lib/authoptions";
import dbConnect from "@/lib/Mongodb";
import { Proposals } from "@/models/proposal/Proposal";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    try{
        await dbConnect()
    const session = await getServerSession(authOptions)
    if(!session?.user.id){
        return NextResponse.json({message:'User Id not exist'},{status:404})
    }

    const body = await req.json();


    const proposal = new Proposals({
        employerId:session.user.id, 
        ...body
    })

    await proposal.save()

        return NextResponse.json({message:'Proposal Applied',proposal},{status:200})
    }
   catch (error: any) {
  console.error("Proposal API Error:", error);
  return NextResponse.json(
    { message: "Server Error", error: error.message, stack: error.stack },
    { status: 500 }
  );
}

}