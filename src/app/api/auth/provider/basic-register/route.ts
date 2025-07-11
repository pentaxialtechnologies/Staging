import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, ...body } = await req.json();

    const user = await Provider.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Update the existing user's profile
    const updatedUser = await Provider.findOneAndUpdate(
      { email },
      { $set: body },
      { new: true },
    );

    return NextResponse.json(
      { message: "User data updated", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 },
    );
  }
}
