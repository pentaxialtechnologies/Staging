import dbConnect from "@/lib/Mongodb";
import CompanyStaff from "@/models/Provider/BenchStaff";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const staff = await CompanyStaff.find({ isApproved: false }).populate({
      path: "OrgId",
      select: "company_name",
    });

    return NextResponse.json({ staff }, { status: 200 });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 },
    );
  }
}
