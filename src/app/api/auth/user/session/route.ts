import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import { authOptions } from "../../../../../lib/authOptions";
import { getServerSession } from 'next-auth';
import {Provider} from "@/models/Provider/Organization";

export async function GET(){
    const session = await getServerSession(authOptions)
    await dbConnect()
    if(!session || !session.user?.email){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await Provider.findOne({email: session.user?.email})
      if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    const {...userData} = user?.toObject()
    
    return NextResponse.json({ user: userData }, { status: 200 });
}