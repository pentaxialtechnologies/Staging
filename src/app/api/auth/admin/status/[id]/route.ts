import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Employers } from "@/models/Employer/Employer";


const allowedStatuses = ['Active','InActive','Suspended']

type RouteContext =  {params :Promise<{id:string}>} 

export async function PUT(req:Request,context: RouteContext){
    const {id} = await context.params;

    const {status} = await req.json()
    if(!allowedStatuses.includes(status)){
        return NextResponse.json({message:'Invalid status value'}, {status:400})
    }

try{
await dbConnect();
const updated = await Employers.findOneAndUpdate({_id:id},{status},{new:true})
await updated?.save()


return NextResponse.json({message:'Employer status updated', updated}, {status:200})
}
catch(error){
    console.error('Error updating employer status:', error);
    return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
}
}