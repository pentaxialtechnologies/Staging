import dbConnect from "@/lib/Mongodb";
import { Provider } from "@/models/Provider/Organization";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { firstname, lastname, email, password, role } = await req.json();

    // Basic validation
    if (!firstname || !lastname || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }


    // Check for existing user
    const existingUser = await Provider.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already registered." },
        { status: 409 }
      );
    }

    
    // Generate email verification token and expiry
    const emailToken = crypto.randomBytes(32).toString("hex");
    const emailTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // const BaseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verifyURL = `https://s3-staffing-website-ivory.vercel.app/verify-email?token=${emailToken}&role=${role}`;


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new provider
    const newProvider = new Provider({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
      emailToken,
      emailTokenExpiresAt,
      emailVerified: false,
    });

    await newProvider.save();

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "balamuruganwebdeveloper@gmail.com",
        pass: "prfp ntni uxla sgly", 
      
      },  tls: {
    rejectUnauthorized: false,
  },
    });

    const mailOptions = {
      from: "balamuruganwebdeveloper@gmail.com",
      to: email,
      subject: "Verify your email",
      // html: `
      //   <p>Hello ${firstname},</p>
      //   <p>Please click the link below to verify your email address:</p>
      //   <a href="${verifyURL}" target="_blank">${verifyURL}</a>
      //   <p><strong>This link will expire in 10 minutes.</strong></p>
      // `,
      html : `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding: 40px 0;">
      <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; font-family:Arial, sans-serif; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        
        <!-- Header with Logo -->
        <tr>
          <td style="background-color:#004aad; padding:20px; text-align:center;">
            <img src="https://www.truefirms.co/main_assets/new_ui/logo.png" alt="Company Logo" width="120" style="display:block; margin:0 auto 10px;">
            <h2 style="color:#ffffff; margin:0; font-size:22px;">Verify Your Email</h2>
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding:30px;">
            <p style="font-size:16px; color:#333333;">Hi <strong>${firstname}</strong>,</p>
            <p style="font-size:16px; color:#333333;">Thank you for signing up. Please confirm your email address by clicking the button below:</p>
            <p style="text-align:center; margin: 30px 0;">
              <a href="${verifyURL}" target="_blank" style="background-color:#004aad; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:6px; font-weight:bold; display:inline-block;">Verify Email</a>
            </p>
            <p style="font-size:14px; color:#555555;">Or copy and paste the link below into your browser:</p>
            <p style="word-break:break-word; font-size:14px; color:#004aad;">${verifyURL}</p>
            <p style="font-size:14px; color:#d9534f;"><strong>This link will expire in 10 minutes.</strong></p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f0f0f0; padding:20px; text-align:center; font-size:12px; color:#777777;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p style="margin: 5px 0;">
            43, First Floor,
            North Masi Street,
                (Opp to Krishnan Kovil),
                Simmakkal,
                  Madurai-625 001.</p>
            <p style="margin: 5px 0;"><a href="mailto:support@s3technology.com" style="color:#004aad; text-decoration:none;">support@s3technology.com</a></p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Provider registered! Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
