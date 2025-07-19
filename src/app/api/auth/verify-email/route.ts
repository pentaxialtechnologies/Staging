import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import { Provider } from "@/models/Provider/Organization";
import { Employers } from "@/models/Employer/Employer";

export async function POST(req: Request) {
  const { token, role } = await req.json();

  if (!token || !role) {
    return NextResponse.json({ message: "Token and role are required" }, { status: 400 });
  }

  try {
    await dbConnect();

    let user;
    if (role === "provider") {
      user = await Provider.findOne({ emailToken: token });
    }  else {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified", id: user._id, email: user.email },
        { status: 409 }
      );
    }

    if (user.emailTokenExpiresAt && user.emailTokenExpiresAt < new Date()) {
      return NextResponse.json({ message: "Verification link expired" }, { status: 400 });
    }

    // ✅ Mark as verified
    user.emailVerified = true;
    user.emailToken = null;
    user.emailTokenExpiresAt = null;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      id: user._id,
      email: user.email,
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}



