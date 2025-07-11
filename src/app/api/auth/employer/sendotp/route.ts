import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { PendingVerification } from "@/models/Employer/PendingVerification";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "balamuruganwebdeveloper@gmail.com",
    pass: "prfp ntni uxla sgly",
  },
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, role } = await req.json();
    if (!email || !role) {
      return NextResponse.json(
        { message: "Email and role are required" },
        { status: 400 },
      );
    }

    const emailVerificationCode = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    await PendingVerification.findOneAndUpdate(
      { email },
      { emailVerificationCode, role, otpExpiresAt },
      { upsert: true, new: true },
    );

    await transporter.sendMail({
      from: "balamuruganwebdeveloper@gmail.com",
      to: email,
      subject: "Your OTP Verification Code",
      html: `<p>Your OTP Verification Code</p> <br/>${emailVerificationCode}<p>Please use this OTP to verify your email address.</p>`,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in Send OTP:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
