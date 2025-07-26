import {  NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import { CompanyProfile } from "@/models/Company";


export type RouteContext = { params: Promise<{ userId: string }> }
export type RouteContexts = { params: Promise<{ userId: string }> }

export async function GET(request: NextRequest, context: RouteContexts )
{
  const  { userId }=  await context.params;

  if (!userId) {
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
  }

  await dbConnect();

  const company = await CompanyProfile.findOne({ createdBy: userId });

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

  const updatedCompany = await CompanyProfile.findOneAndUpdate(
    { createdBy: userId },
    body,
    { new: true }
  );

  if (!updatedCompany) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ company: updatedCompany }, { status: 200 });
}
