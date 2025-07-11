import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import BenchStaff from "@/models/Provider/BenchStaff";

type RouteContexts = { params: Promise<{ id: string }> }

export async function DELETE(req:Request,context: RouteContexts){
 try{
    const {id} = await context.params
    await dbConnect()
const staff = await BenchStaff.findByIdAndDelete(id)
if(!staff){
        return NextResponse.json({message:'Deletion Failed'})
}
        return NextResponse.json({message:'Deleted',staff})

    }
    catch(error){
        return NextResponse.json({message:'Server Error',error})
    }
}