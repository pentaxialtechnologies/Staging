import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/Mongodb";
import { Employer } from "@/models/Employer/Employer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullname, email, password, phone } = body;

    if (!fullname || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    const existingUser = await Employer.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User Already Registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Employer({
      fullname,
      email,
      password: hashedPassword,
      phone,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
