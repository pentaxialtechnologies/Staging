import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import { authOptions } from "../../../../../lib/authOptions"; // fix relative path if needed
import { getServerSession } from "next-auth";
import { Provider } from "@/models/Provider/Organization";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await Provider.findOne({ email: session.user.email }).lean(); // faster with lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching provider:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
