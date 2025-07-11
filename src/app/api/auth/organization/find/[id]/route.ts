import dbConnect from "@/lib/Mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";

type RouteContexts = { params: Promise<{ id: string }> };
export async function GET(req: NextRequest, context: RouteContexts) {
  try {
    const { id } = await context.params; // ✅ Directly accessing the dynamic route param
    await dbConnect();
    const company = await Provider.findById(id);
    if (!company) {
      return NextResponse.json(
        { message: "Company id does not exist" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Company Details", company },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 },
    );
  }
}
