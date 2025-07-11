import { Jobs } from "@/models/ContractJob";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const pendingjobs = await Jobs.find({ status: "pending" }).populate(
      "postedBy",
    );
    if (!pendingjobs) {
      return NextResponse.json({ message: "Request list is empty" });
    }
    return NextResponse.json(pendingjobs);
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(
      { message: "Failed to load jobs", error: error.message },
      { status: 500 },
    );
  }
}
