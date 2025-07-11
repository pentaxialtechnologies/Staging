import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';


export async function POST(req:Request){
    const {to,subject,message} = await req.json()

     if (!to || !subject || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  try{
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user:'balamuruganwebdeveloper@gmail.com',
        pass:'prfp ntni uxla sgly'
    }
})

const mailOption ={
    from: 'balamuruganwebdeveloper@gmail.com',
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