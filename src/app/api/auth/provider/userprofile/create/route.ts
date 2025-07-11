import UserProfile from "@/models/Provider/UserProfile";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      userId,
      userprofile,
      username,
      headline,
      industry,
      public_profile_url,
    } = body;

    // ✅ Optional: Check for existing profile to prevent duplicates
    const existing = await UserProfile.findOne({ userId });
    if (existing) {
      return NextResponse.json(
        { message: "Profile already exists" },
        { status: 409 },
      );
    }

    // ✅ Create and save user profile
    const user = await UserProfile.create({
      userId,
      userprofile,
      username,
      headline,
      industry,
      public_profile_url,
    });

    return NextResponse.json(
      { message: "Profile Registered Successfully!", user },
      { status: 201 },
    );
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
