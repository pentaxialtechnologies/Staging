import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb"; // 👈 Import this

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ success: true, message: "Admin created" }, { status: 201 });
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  catch (error: any) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
