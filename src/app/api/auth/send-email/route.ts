import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';


export async function POST(req:Request){
    const {to,subject,message} = await req.json()

     if (!to || !subject || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  try{
const transporter = nodemailer.createTransport({
 service:process.env.NEXT_PUBLIC_SERVICE || 'Gmail',
auth:{
    user:process.env.NEXT_PUBLIC_EMAIL_USER || '',
    pass:process.env.NEXT_PUBLIC_EMAIL_PASSWORD || ""
}
})

const mailOption ={
    from: process.env.NEXT_PUBLIC_EMAIL_USER,
    to,
    subject,
    html: `<div><p>${message}</p></div>`
}

await  transporter.sendMail(mailOption)
return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });

  }
  catch{
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}