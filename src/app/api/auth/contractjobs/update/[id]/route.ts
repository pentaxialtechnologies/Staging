import dbConnect from "@/lib/Mongodb";
import { Jobs } from "@/models/ContractJob";
import { NextResponse,NextRequest } from "next/server";

export async function PUT(req:NextRequest,{params}:{params:{id:string}}){

    try{
await dbConnect();
const {id} = params
const user = await Jobs.findById(id)
if(!user){
    return NextResponse.json({message:'Job not found'},{status:404})
}
const Updatedjob = await req.json()

const job = await Jobs.findByIdAndUpdate(id,
    {$set: Updatedjob},
    {new: true}
)

if(!job){
    return NextResponse.json({message:'Update failed'},{status:400})
}
    return NextResponse.json({message:'Updated Job',job},{status:200})
    }
    catch(error){
        return NextResponse.json({message:'Server Error'},{status:500})
    }
}