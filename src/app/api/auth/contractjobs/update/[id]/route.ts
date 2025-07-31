import dbConnect from "@/lib/Mongodb";
import { Jobs } from "@/models/ContractJob";
import { NextResponse, NextRequest } from "next/server";

type RouteContext = { params: Promise<{ id: string }>};

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    await dbConnect();

    const { id } = await context.params;
    const jobData = await req.json();

    const existingJob = await Jobs.findById(id);
    if (!existingJob) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const updatedJob = await Jobs.findByIdAndUpdate(
      id,
      { $set: jobData },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ message: "Update failed" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Updated Job", job: updatedJob },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update job error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
