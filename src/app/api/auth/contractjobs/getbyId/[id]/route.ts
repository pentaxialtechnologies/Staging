import { Jobs } from "@/models/ContractJob";
import dbConnect from "@/lib/Mongodb";
import { NextResponse, NextRequest } from "next/server";

export type RouteContexts = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContexts) {
  try {
    const { id } = await context.params; // ✅ Directly accessing the dynamic route param
    await dbConnect();
    const job = await Jobs.findById(id);
    if (!job) {
      return NextResponse.json({ message: "Job not Found" });
    }
    return NextResponse.json({ message: "Job-List", job });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error });
  }
}
