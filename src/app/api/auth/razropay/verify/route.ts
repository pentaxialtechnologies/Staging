import { NextRequest,NextResponse } from "next/server";
import crypto from 'crypto'

export async function POST(req:NextRequest) {

    const body = await req.json()
const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = body

const generated_signature = crypto.createHmac('sha256','rzp_test_iyYfx6r40I8yTl').update(`${razorpay_order_id}| ${razorpay_payment_id}`).digest('hex')

if(generated_signature === razorpay_signature){
    return NextResponse.json({ success: true, message: "Payment verified successfully" }, { status: 200 });
}
return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
}