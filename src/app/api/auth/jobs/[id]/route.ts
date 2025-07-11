import { Jobs } from "@/models/ContractJob";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";

type RouteContexts = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContexts) {
  try {
    const { id } = await context.params; // ✅ Directly accessing the dynamic route param
    await dbConnect();
    const job = await Jobs.findById(id).populate("postedBy");

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(
      { message: "Error fetching job", error: error.message },
      { status: 500 },
    );
  }
}
