import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";
import { Employers } from "@/models/Employer/Employer";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password, token } = await req.json();

    // Validate required fields
    if (!email || !token || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Find user in Provider or Employer collection
    let user = await Provider.findOne({ email });
    if (!user) {
      user = await Employers.findOne({ email });
    }

    if (
      !user ||
      !user.resetToken ||
      !user.resetTokenExpiry
    ) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 404 });
    }

    // Validate token
    const isTokenValid =
      user.resetToken === token &&
      new Date(user.resetTokenExpiry) > new Date();

    if (!isTokenValid) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Hash new password and reset token fields
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({ message: "Password has been reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Server Error", error }, { status: 500 });
  }
}
