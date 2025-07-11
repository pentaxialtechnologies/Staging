import dbConnect from "@/lib/Mongodb";
import BenchStaff from "@/models/Provider/BenchStaff";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const staff = new BenchStaff({ ...body });

    await staff.save();

    return NextResponse.json(
      { message: "Registered Staff", staff },
      { status: 201 }
    );
  } catch (error) {
    console.error("Staff registration error:", error);
    return NextResponse.json(
      { message: "Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
