import UserProfile from "@/models/Provider/UserProfile";
import dbConnect from "@/lib/Mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ userId: string }> };
// --------------------- GET by userId ---------------------
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await dbConnect();
    const { userId } = await context.params;

    if (!userId) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const user = await UserProfile.findOne({ userId }).populate("userId");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User data fetched successfully", user },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// --------------------- PUT update by userId ---------------------
type RouteContexts = { params: Promise<{ userId: string }> };

export async function PUT(req: NextRequest, context: RouteContexts) {
  try {
    await dbConnect();
    const { userId } = await context.params;
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const updatedUser = await UserProfile.findOneAndUpdate(
      { userId }, // Match by userId field
      {
        $set: {
          userprofile: body.userprofile,
          username: body.username,
          headline: body.headline,
          industry: body.industry,
          public_profile_url: body.public_profile_url,
        },
      },
      { new: true, upsert: false },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User profile not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
