import { Jobs } from "@/models/ContractJob";
import dbConnect from "@/lib/Mongodb";
import { NextResponse, NextRequest } from "next/server";

export type RouteContext = { params: { id: string } }

// ✅ GET job(s) by `postedBy`
export async function GET(req: Request, context: RouteContext) {
  await dbConnect();
  const { id } = context.params;

  try {
    const jobs = await Jobs.find({ postedBy: id,  });

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ error: "Jobs not found" }, { status: 404 });
    }

    return NextResponse.json(jobs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT update job by ID
export async function PUT(req: NextRequest, context: RouteContext) {
  await dbConnect();
  const { id } = context.params;

  try {
    const body = await req.json();
    const updatedJob = await Jobs.findByIdAndUpdate(id, body, { new: true });

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job updated", updatedJob });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

// ✅ DELETE job by ID
export async function DELETE(req: Request, context: RouteContext) {
  await dbConnect();
  const { id } = context.params;

  try {
    const deletedJob = await Jobs.findByIdAndDelete(id);

    if (!deletedJob) {
      return NextResponse.json({ error: "Job deletion failed" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job deleted", deletedJob });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
