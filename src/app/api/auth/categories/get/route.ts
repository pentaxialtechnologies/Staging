import ServiceCategory from "@/models/Provider/ServiceCategory";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const category = await ServiceCategory.find();
    if (!category) {
      return NextResponse.json({ message: "Category is empty" });
    }
    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error });
  }
}
