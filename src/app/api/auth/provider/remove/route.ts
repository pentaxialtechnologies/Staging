import dbConnect from "@/lib/Mongodb";
import { Provider } from "@/models/Provider/Organization";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, index } = await req.json();
    await dbConnect();

    const provider = await Provider.findById(id);
    if (!provider) return NextResponse.json({ message: "Provider not found" }, { status: 404 });

    // Update isdelete flag
    provider.portfolio[index].isdelete = true;
    await provider.save();

    return NextResponse.json({ message: "Portfolio item marked as deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error deleting portfolio item" }, { status: 500 });
  }
}
