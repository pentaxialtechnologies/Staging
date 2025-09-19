import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../../../lib/authOptions";
import dbConnect from "@/lib/Mongodb";
import { Employers } from "@/models/Employer/Employer";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' });
    }

    await dbConnect();

  await Employers.findOneAndUpdate(
  { email: session.user.email },
  {
    $set: {
      lastActiveAt: new Date(),
    },
    $setOnInsert: {
      email: session.user.email,
    },
  },
  { new: true, upsert: true, setDefaultsOnInsert: true }
)
    return NextResponse.json({ message: 'Last Active Updated' });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: 'Server Error', error });
  }
}
