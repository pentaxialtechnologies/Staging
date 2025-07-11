import dbConnect from "@/lib/Mongodb";
import { Provider } from "@/models/Provider/Organization";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, oldpassword, newpassword } = await req.json();

    if (!userId || !oldpassword || !newpassword) {
      return NextResponse.json(
        { message: "Missing Required Fields" },
        { status: 400 },
      );
    }
    const user = await Provider.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid Password" },
        { status: 401 },
      );
    }

    const hashpassword = await bcrypt.hash(newpassword, 10);
    user.password = hashpassword;
    await user.save();
    return NextResponse.json(
      { success: true, message: "Password updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 },
    );
  }
}
