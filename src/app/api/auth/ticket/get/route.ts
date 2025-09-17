import dbConnect from "@/lib/Mongodb";
import { Employer_Tickets } from "@/models/ticket/EmployersTickets";
import { NextResponse } from "next/server";

type ContextType = {params: Promise<{id:string}>}

export async function GET(req:Request){
    try{
        // const {id} = await context.params
        const Tickets = await Employer_Tickets.find().populate('userId').sort({createdAt: -1})
        if(!Tickets){
        return NextResponse.json({message:'Tickets is Not found'},{status:404})
        }

        return NextResponse.json({message:'Tickets list',Tickets},{status:200})
    }
    catch(error){
        return NextResponse.json({message:'Server Error'},{status:500})
    }
}