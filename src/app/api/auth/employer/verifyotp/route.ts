import dbConnect from "@/lib/Mongodb";
import { PendingVerification } from "@/models/Employer/PendingVerification";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, emailVerificationCode } = body;

    if (!email || !emailVerificationCode) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const pendingVerification = await PendingVerification.findOne({ email });

    if (!pendingVerification) {
      return NextResponse.json(
        { message: "No pending verification found for this email." },
        { status: 404 }
      );
    }

    if (pendingVerification.otpExpiresAt < new Date()) {
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (pendingVerification.emailVerificationCode !== emailVerificationCode) {
      return NextResponse.json(
        { message: "Invalid OTP. Please check and try again." },
        { status: 400 }
      );
    }

    // Update fields after successful verification
    pendingVerification.emailVerified = true;
    pendingVerification.emailVerificationCode = emailVerificationCode;
    await pendingVerification.save();

    return NextResponse.json(
      { message: "Email verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
