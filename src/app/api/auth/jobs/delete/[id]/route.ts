import { Jobs } from "@/models/ContractJob";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";

type RouteContext = {params :Promise<{id:string}> }
export async function PUT(req:Request,context:RouteContext){
try{
await dbConnect();

const {id} = await context.params
const {isDeleted} = await req.json()

const job = await Jobs.findByIdAndUpdate(id,{isDeleted},{new: true})
 if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }
       return NextResponse.json({ message: "Job updated successfully", job })
}
catch(error){
    return NextResponse.json({message:'Internal Server Error'})
}
}