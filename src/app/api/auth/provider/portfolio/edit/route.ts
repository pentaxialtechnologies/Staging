import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";

export async function POST(req:Request){
    try{
await dbConnect()
const {id,index,portfolio} = await req.json()
const provider = await Provider.findById(id)
if(!provider){
return NextResponse.json({message:'Provider not Found'})        
}
provider.portfolio[index]= {...provider.portfolio[index],...portfolio}
await provider.save()
return NextResponse.json({ message: 'Portfolio updated successfully' }, { status: 200 })
    }
    catch(error){
return NextResponse.json({message:'Server Error',error})        
    }
}