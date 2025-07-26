import { Employers } from "@/models/Employer/Employer";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import nodemailer from 'nodemailer';


const Transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.NEXT_PUBLIC_EMAIL_USER,
        pass:process.env.NEXT_PUBLIC_EMAIL_PASSWORD
    }
})

 async function sendEmail(to:string,subject:string,message:string){
    const mailOptions = {
        from: process.env.NEXT_PUBLIC_EMAIL_USER,
        to:to,
        subject:subject,
        html:message
    }
    try{
    await Transporter.sendMail(mailOptions)
    console.log('Email sent successfully');
}
catch(error){
    throw new Error('Email Sending Failed')
}
}

export async function POST(req:Request)
{
 try{
        await dbConnect()
        const {email,newEmail,userId} = await req.json()
const useremail = await Employers.findOne({email})
if(!useremail){
    return NextResponse.json({message:'User Email does not exist'}, { status: 400 })
}
const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();


const provider =await Employers.findById(userId)
 if (!provider) return NextResponse.json({ message: 'User not found' }, { status: 404 });


 provider.emailVerificationCode = verificationCode
 provider.tempEmail = newEmail
 await provider.save()
 
 await sendEmail(newEmail,'Verify Your Email',`Your verification Code is ${verificationCode}`)
    
return NextResponse.json({ message: 'Verification code sent to new email' });
}
    catch(error){
        return NextResponse.json({message:'server error',error})
    }
}
