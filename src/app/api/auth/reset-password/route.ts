import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";
import { Employers } from "@/models/Employer/Employer";
import crypto from 'crypto'
import nodemailer from 'nodemailer';
export async function POST(req:Request){
    try{
await dbConnect();
const {email} = await req.json();
        
if(!email){
        return NextResponse.json({message:"Email is Required"})
}
  let user = await Provider.findOne({email})
  let role='provider'
     if(!user){
        user = await Employers.findOne({email})
        role='employer'
     }

     if(!user){
        return NextResponse.json({message:"Invalid Email"},{status:404})
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const expiryToken = new Date(Date.now() + 1000 * 60 * 60) // 1 hour from now
        user.resetToken = resetToken;
        user.resetTokenExpiry = expiryToken
        await user.save()


        const transporter = nodemailer.createTransport(
            {
                service:process.env.NEXT_PUBLIC_SERVICE || 'Gmail',
                auth:{
                    user:process.env.NEXT_PUBLIC_EMAIL_USER || '',
                    pass:process.env.NEXT_PUBLIC_EMAIL_PASSWORD || ""
                }
            }
        )

        const URL = process.env.NEXT_PUBLIC_VERIFY_URL || 'http://localhost:3000'
        
        const resetLink = `${URL}/users/reset-password?token=${resetToken}&role=${role}`

        const mailOptions = {
            from:process.env.NEXT_PUBLIC_EMAIL_USER,
            to:email,
            subject: "Reset Your Password",
             html: `
            <h2>Password Reset Request</h2>
         <p>We received a request to reset your password. Click the link below to proceed:</p>
            <a href="${resetLink}" style="padding:10px 20px; background:#0070f3; color:white; text-decoration:none;">Reset Password</a>
            <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
            `,
        }

await transporter.sendMail(mailOptions)

  return NextResponse.json({ message: "Reset link sent to your email." }); 
    }
    catch(error){
        console.error(error);
        
    }
}