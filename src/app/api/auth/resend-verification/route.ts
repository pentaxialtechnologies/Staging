import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import crypto from 'crypto'
import { Provider } from "@/models/Provider/Organization";
import { Employer } from "@/models/Employer/Employer";
import nodemailer from 'nodemailer'

export async function POST(req:Request){
    try{
await dbConnect();

const {email,role} = await req.json()

if(!email || !role){
        return NextResponse.json({message:'Email is Required'},{status:400})
}

let user;

switch(role){
    case 'provider':
    user = await Provider.findOne({email})
    break;
    case 'employer':
    user = await Employer.findOne({email})
    break;
    default:
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
}
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

   if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified" }, { status: 400 });
    }
const now = new Date();
const fiveMinutes = new Date(now.getTime() -5 * 60 * 1000)

 if (user.emailTokenExpiresAt && user.emailTokenExpiresAt > fiveMinutes) {
    return NextResponse.json({ message: "Please wait before requesting again" }, { status: 429 });
  }

  
const newToken =crypto.randomBytes(32).toString('hex')
const TokenExpiryAt = new Date(Date.now()* 10 *60 * 1000)

user.emailToken = newToken
user.emailTokenExpiresAt = TokenExpiryAt
await user.save()

// const VerifyURL = `http://localhost:3000/verify-email?token=${newToken}&role=${role}`
// const VerifyURL = `https://s3-staffing-website-smoky.vercel.app/verify-email?token=${newToken}&role=${role}`
 const VerifyURL = `https://s3-staffing-website-ivory.vercel.app/verify-email?token=${newToken}&role=${role}`



   
const transporter = nodemailer.createTransport(
    {
    service:'Gmail',
   auth:{
    user:'balamuruganwebdeveloper@gmail.com',
    pass:'prfp ntni uxla sgly'
   }
    })

    const MailOptions ={
        from :'balamuruganwebdeveloper@gmail.com',
        to:email,
        subject:'Resend: Verify your email',
         html: `
        <p>Please click the link below to verify your email address:</p>
        <a href="${VerifyURL}">${VerifyURL}</a>
        <p><strong>This link will expire in 10 minutes.</strong></p>
      `,
    }

  await transporter.sendMail(MailOptions);
}
    catch(error){
        return NextResponse.json({message:'Internal server Error',error})
    }
}