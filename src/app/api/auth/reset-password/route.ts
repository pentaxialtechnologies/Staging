import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";
import { Employer } from "@/models/Employer/Employer";
import crypto from "crypto";
import nodemailer from "nodemailer";
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is Required" });
    }
    let user = await Provider.findOne({ email });
    let role = "provider";
    if (!user) {
      user = await Employer.findOne({ email });
      role = "employer";
    }

    if (!user) {
      return NextResponse.json({ message: "Invalid Email" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiryToken = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
    user.resetToken = resetToken;
    user.resetTokenExpiry = expiryToken;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "balamuruganwebdeveloper@gmail.com",
        pass: "prfp ntni uxla sgly",
      },
    });

    // const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const BASE_URL =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://s3-staffing-website-smoky.vercel.app/";

    const resetLink = `${BASE_URL}/users/reset-password?token=${resetToken}&role=${role}`;

    const mailOptions = {
      from: "balamuruganwebdeveloper@gmail.com",
      to: email,
      subject: "Reset Your Password",
      html: `
            <h2>Password Reset Request</h2>
         <p>We received a request to reset your password. Click the link below to proceed:</p>
            <a href="${resetLink}" style="padding:10px 20px; background:#0070f3; color:white; text-decoration:none;">Reset Password</a>
            <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
            `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error(error);
  }
}
