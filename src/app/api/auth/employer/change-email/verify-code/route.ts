import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Employers } from "@/models/Employer/Employer";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { userId, verificationCode } = await req.json();

    const employer = await Employers.findById(userId);
    if (!employer) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (employer.emailVerificationCode !== verificationCode) {
      return NextResponse.json({ message: "Invalid Verification Code" }, { status: 400 });
    }

if (!employer.tempEmail) {
  return NextResponse.json({ message: "No pending email to verify" }, { status: 400 });
}

employer.email = employer.tempEmail;
employer.tempEmail = '';
employer.emailVerificationCode = '';


    await employer.save();

    return NextResponse.json({ message: "Email updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message || error }, { status: 500 });
  }
}
