import { NextRequest, NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";
import dbConnect from "@/lib/Mongodb";

type RouteContexts = { params: Promise<{ userId: string }> };
export async function PUT(request: NextRequest, context: RouteContexts) {
  const { userId } = await context.params;

  try {
    await dbConnect();
    const body = await request.json();

    const updated = await Provider.findByIdAndUpdate(userId, body, {
      new: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error("PUT Error:", error);
    return NextResponse.json(
      { message: "Profile update failed", error },
      { status: 500 },
    );
  }
}

type RouteContext = { params: Promise<{ userId: string }> };

export async function GET(req: Request, context: RouteContext) {
  try {
    await dbConnect();
    const { userId } = await context.params;

    const company = await Provider.findById(userId);
    if (!company) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("GET Organization error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
