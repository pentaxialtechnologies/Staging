import { NextResponse } from "next/server";
import dbConnect from "@/lib/Mongodb";
import { Employer } from "@/models/Employer/Employer";
import { Jobs } from "@/models/ContractJob";
import {Provider} from "@/models/Provider/Organization";
import { Applications } from "@/models/Application";

export async function GET() {
  try {
    await dbConnect();

    const [
      jobSeekerCount,
     ProviderCount,
      jobPostCount,
      applicationCount,
    ] = await Promise.all([
      Employer.countDocuments(),
      Provider.countDocuments(),
      Jobs.countDocuments(),
      Applications.countDocuments(),
    ]);

    return NextResponse.json(
      {
        jobSeekers: jobSeekerCount,
        Providers: ProviderCount,
        jobPosts: jobPostCount,
        applications: applicationCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 501 }
    );
  }
}
