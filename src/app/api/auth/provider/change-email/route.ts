import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "balamuruganwebdeveloper@gmail.com",
    pass: "prfp ntni uxla sgly",
  },
});

async function SendEmail(to: string, subject: string, message: string) {
  const mailOptions = {
    from: "balamuruganwebdeveloper@gmail.com",
    to: to,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Email sending failed");
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, newEmail, userId } = await req.json();
    const useremail = await Provider.findOne({ email });
    if (!useremail) {
      return NextResponse.json(
        { message: "User Email does not exist" },
        { status: 400 },
      );
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const provider = await Provider.findById(userId);
    if (!provider)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    provider.emailVerificationCode = verificationCode;
    provider.tempEmail = newEmail;
    await provider.save();

    await SendEmail(
      newEmail,
      "Verify Your Email",
      `Your verification Code is ${verificationCode}`,
    );

    return NextResponse.json({
      message: "Verification code sent to new email",
    });
  } catch (error) {
    return NextResponse.json({ message: "server error", error });
  }
}
