import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import BenchStaff from "@/models/Provider/BenchStaff";

export async function GET() {
  try {
    await dbConnect();
    const staff = await BenchStaff.find().populate({
      path: "OrgId",
      select: {
        company_name: 1,
        companylogo: 1,
      },
    });
    if (!staff) {
      return NextResponse.json({ message: "Staff Not Found" });
    }
    return NextResponse.json({ message: "Datas fetched", staff });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error });
  }
}
