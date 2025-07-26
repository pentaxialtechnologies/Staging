import dbConnect from "@/lib/Mongodb";
import {Provider} from "@/models/Provider/Organization";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await dbConnect()
const company = await Provider.find();
if(!company){
        return NextResponse.json({message:'Company list is Empty'},{status:400})
}
    return NextResponse.json({message:'Company list',company},{status:200})

    }
    catch(error){
        return NextResponse.json({message:'Internal Server Error',error},{status:500})
    }
}