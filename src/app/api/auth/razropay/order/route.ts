import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';


const razorpay = new Razorpay({
    key_id:  process.env.NEXT_PUBLIC_RAZRO_KEY || '',
    key_secret: process.env.NEXT_PUBLIC_RAZRO_KEY_SECRET || '',
})


export async function POST(req:Request){
   
const body = await req.json()
const {amount} = body

const options ={
    amount: amount * 100,
    currency:'INR',
    receipt: `receipt_${Date.now()}`,
    payment_capture:1
}
 try{
    const order = await razorpay.orders.create(options)
    return NextResponse.json({ order }, { status: 200 });

    }
    catch(err){
        console.error("Error creating Razorpay order:", err);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}