import { Provider } from "@/models/Provider/Organization";
import dbConnect from "@/lib/Mongodb";
import { NextRequest, NextResponse } from "next/server";

// ✅ You are using Promise based params
type RouteContexts = { params: Promise<{ id: string }> };

// GET handler (Correct)
export async function GET(req: NextRequest, context: RouteContexts) {
  await dbConnect();
  const { id } = await context.params;

  const user = await Provider.findById(id);
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

// ✅ PUT handler (Updated to use the same RouteContexts type)
export async function PUT(req: Request, context: RouteContexts) {
  const { id } = await context.params;

  const body = await req.json();
  await dbConnect();

  const updateData = {
    ...body,
    hasCompletedPlanSelection: true,
  };

  const updated = await Provider.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updated)
    return NextResponse.json({ message: "Update failed" }, { status: 400 });

  return NextResponse.json({ message: "Profile updated", updated });
}
