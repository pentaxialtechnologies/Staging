import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Employer_Tickets } from "@/models/ticket/EmployersTickets";
import { employer_conversation } from "@/models/ticket/Conversation";

type ContextType = {params:Promise<{id :string}>}
// 
export async function POST(req: Request, context: ContextType) {
  try {
    await dbConnect()
    const { id } = await context.params;

    const { messages } = await req.json();
    const { author, content, authorRole } = messages?.[0] || {};
    console.log(author, content, authorRole, 'fields from reply');
    

    if (!author || !content) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const ticket = await Employer_Tickets.findById(id);
    if (!ticket) {
      return NextResponse.json({ message: "Ticket Not found" }, { status: 404 });
    }

    const Conversation = await employer_conversation.create({
      ticketId: id,
      messages: [{ author, authorRole, content }],
    });
    ticket.ticket_status = "Open";
    await ticket.save();

    return NextResponse.json(
      { message: "Reply added", data: Conversation },
      { status: 201 }
    );
  } catch (error:any) {
    return NextResponse.json({ message:error.message || "Server Error" }, { status: 500 });
  }
}



export async function GET(req:Request,context:ContextType){
try{
    await dbConnect();

const {id} =await context.params
const ticket = await employer_conversation.find({ticketId:id}).sort({createdAt:1}).populate('ticketId')
if(!ticket){
    return NextResponse.json({message:"Ticket Not found"},{status:400})
}
return NextResponse.json({data:ticket},{status:200})
}
catch(error){
  return NextResponse.json({message:'Server Error'},{status:500})
}
}



export async function PUT(req:Request,context:ContextType){
try{
        await dbConnect()

const {id} = await context.params
const {ticket_status} = await req.json()
const ticket = await Employer_Tickets.findByIdAndUpdate(id,{ticket_status},{new:true})
if(!ticket){
  return NextResponse.json({message:'Status Update Failed'},{status:400})
}
await ticket?.save()
return NextResponse.json({message:'Status Updated'},{status:200})

}
catch(error){
    return NextResponse.json({message:'Server Error'},{status:500})
}
}