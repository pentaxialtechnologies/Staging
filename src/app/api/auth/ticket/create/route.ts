import mongoose from "mongoose";
import { Employer_Tickets } from "@/models/ticket/EmployersTickets";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    // Convert userId string to ObjectId
    const ticketData = {
      ...body,
      userId: new mongoose.Types.ObjectId(body.userId),
    };

    const ticket = await Employer_Tickets.create(ticketData);

    if (!ticket) {
      return NextResponse.json({ message: "Failed to Create Ticket" }, { status: 400 });
    }

    return NextResponse.json({ message: "Ticket Created", ticket }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
