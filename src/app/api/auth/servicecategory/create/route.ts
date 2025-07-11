import ServiceCategory from "@/models/Provider/ServiceCategory";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const category = new ServiceCategory(body); 

    await category.save(); 

    return NextResponse.json({ message: "Category Created", category }, { status: 200 });
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  catch (error: any) {
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
