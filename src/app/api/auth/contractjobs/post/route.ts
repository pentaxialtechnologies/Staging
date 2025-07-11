import { Jobs } from "@/models/ContractJob";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("Received job payload:", JSON.stringify(body, null, 2));

    const { payload, postedBy } = body;

    const job = await Jobs.create({
      ...payload,
      postedBy, 
      status: "pending",
    });

    return NextResponse.json({ message: "Job created", job }, { status: 201 });
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  catch (error: any) {
    console.error("Job creation error:", error);
    return NextResponse.json(
      {
        message: "Server Error",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
