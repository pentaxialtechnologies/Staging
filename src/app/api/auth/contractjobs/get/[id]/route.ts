import { Jobs } from "@/models/ContractJob";
import dbConnect from "@/lib/Mongodb";
import { NextResponse,NextRequest } from "next/server";


export type RouteContext = { params: Promise<{ id: string }> }
export type RouteContexts = { params: Promise<{ id: string }> }

export async function GET(
  req: Request,
  context: RouteContexts
) {
  await dbConnect();

  const { id } = await context.params;
  try {
    const jobs = await Jobs.find({ postedBy: id, isDeleted: { $exists: false }})

    if (!jobs) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }


    return NextResponse.json(jobs, { status: 200 });
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  catch (error: any) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(req:NextRequest,context:RouteContext){
await dbConnect();
try{
const  { id } = await context.params;
    const body = await req.json()
const updatedJob = await Jobs.findByIdAndUpdate(id,body,{new:true})
    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
        return NextResponse.json({ message: "Job updated", updatedJob });
}
catch(error){
        return NextResponse.json({message:'Internal Server Error',error})
    }
}

export async function DELETE(req:Request,context: RouteContexts){
    
try{
  const {id} = await context.params; 
const jobdelete = await Jobs.findByIdAndDelete(id)
if (!jobdelete) {
      return NextResponse.json({ error: "Job deleted Failed" }, { status: 404 });
    }
        return NextResponse.json({ message: "Job Deleted", jobdelete });

}
catch(error){
        return NextResponse.json({message:'Internal Server Error',error})
    }

}
