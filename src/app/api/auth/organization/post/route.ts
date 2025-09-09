import  {Provider} from "@/models/Provider/Organization";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
await dbConnect();
const {firstname,lastname,email,phone_number,password} = await req.json()
   const existing = await Provider.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

const organizations = new Provider({
firstname,lastname,email,phone_number,password
})

await organizations.save()

return NextResponse.json({message:'Registered Successfully',organizations})
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(error:any){
        NextResponse.json({message:'Internal server Error',error})
    }
}


