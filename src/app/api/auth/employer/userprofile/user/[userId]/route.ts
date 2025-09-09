import {  NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import { EmployerProfile } from "@/models/Employer/UserProfile";


export type RouteContext = { params: Promise<{ userId: string }> }
export type RouteContexts = { params: Promise<{ userId: string }> }

export async function GET(request: NextRequest, context: RouteContexts )
{
  await dbConnect();

  const  { userId }=  await context.params;

  if (!userId) {
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
  }


  const company = await EmployerProfile.findOne({ createdBy: userId });

  if (!company) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ company }, { status: 200 });
}


export async function PUT(
  request: Request,
 context: RouteContext
){
  const { userId } =await context.params;

  if (!userId) {
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
  }

  const body = await request.json();

  await dbConnect();

  const updatedCompany = await EmployerProfile.findOneAndUpdate(
    { createdBy: userId },
    body,
    { new: true }
  );

  if (!updatedCompany) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ company: updatedCompany }, { status: 200 });
}
