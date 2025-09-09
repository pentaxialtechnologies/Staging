import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";


const allowedStatus = ['Active','InActive','Suspended']

type RouteContext = {params:Promise<{id:string}>}


export async function PUT(req:Request,Context:RouteContext){
    try{
        const {id} =await  Context.params

        const {status} = await req.json()

        if(!allowedStatus.includes(status)){
            return NextResponse.json({message:'Invalid Status'},{status:400})
        }

        await dbConnect()
    const updated = await Provider.findOneAndUpdate({_id:id},{status},{new: true})

    await updated?.save()
    return NextResponse.json({message:'Provider Status Updated'},{status:200})
    }
    catch(error){

    }
}