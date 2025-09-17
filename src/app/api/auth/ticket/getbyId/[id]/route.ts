import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Employer_Tickets } from "@/models/ticket/EmployersTickets";

type ContextType ={params:{id:Promise<{id:string}>}}

export async function GET(req:Request,context:ContextType){
    try{
    const {id} = await context.params
    const ticket = await Employer_Tickets.findById(id).populate('userId')
    if(!ticket){
        return NextResponse.json({message:'Ticket Not found'},{status:404})
    }
        return NextResponse.json({data:ticket},{status:200})
    }
    catch(error){
        return NextResponse.json({message:'Internal Server Error'},{status:500})
    }
}