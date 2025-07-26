import dbConnect from "@/lib/Mongodb";
import BenchStaff from "@/models/Provider/BenchStaff";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const orgId = req.nextUrl.searchParams.get("orgId");
    if (!orgId) {
      return NextResponse.json({ message: "OrgId is required" }, { status: 400 });
    }

    const staff = await BenchStaff.find({ OrgId: orgId })

    if (!staff || staff.length === 0) {
      return NextResponse.json({ message: "No staff found for this organization." }, { status: 404 });
    }

    return NextResponse.json({ staff }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
