import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Provider } from "@/models/Provider/Organization";


export async function POST(req:Request){
    try{
        await dbConnect()
    const {userId,verificationCode} = await req.json()

    const provider = await Provider.findById(userId)
    if(!provider){
        return NextResponse.json({message:'User not found'}, { status: 404 })
    }

    if(provider.emailVerificationCode !== verificationCode){
        return NextResponse.json({message:'Invalid Verification Code'}, { status: 400 })
    }

    provider.email = provider.tempEmail
    provider.tempEmail = ''
    provider.emailVerificationCode =''

    await provider.save()
    return NextResponse.json({ message: 'Email updated successfully' }, { status: 200 });
    }
    
    catch(error){
      return NextResponse.json({ message: 'Server error',error }, { status: 500 });
    }
}    