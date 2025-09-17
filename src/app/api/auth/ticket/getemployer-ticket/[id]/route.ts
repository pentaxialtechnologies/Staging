import dbConnect from "@/lib/Mongodb";
import { Employer_Tickets } from "@/models/ticket/EmployersTickets";
import { NextResponse } from "next/server";

type ContextType = {params:Promise<{id:string}>}
export async function GET(req:Request,context:ContextType){
try{
const {id} = await context.params;
const ticket = await Employer_Tickets.find({userId:id})
if(!ticket){
    return NextResponse.json({message:'Ticket not found'},{status:400})
}
    return NextResponse.json({data:ticket},{status:200})
}
catch(error){
    return NextResponse.json({message:'Server Error'},{status:500})
}
}