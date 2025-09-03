import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { Employers } from "@/models/Employer/Employer";
import { EmployerProfile } from "@/models/Employer/UserProfile";
import UserProfile from "@/models/Provider/UserProfile";
import { Jobs } from "@/models/ContractJob";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all employers
    const employers = await Employers.find().lean();

    if (!employers || employers.length === 0) {
      return NextResponse.json({ message: "No Employer found" }, { status: 404 });
    }

    // Attach profile and users to each employer
    const employersWithDetails = await Promise.all(
      employers.map(async (employer) => {
        const profile = await EmployerProfile.findOne({ createdBy: employer._id }).lean();
        const JobCount = await Jobs.countDocuments({ postedBy: employer._id });
        return {
          fullname: employer.fullname,
          _id: employer._id,
          status: employer.status,
          companyName: profile?.companyname || '',
          phone: employer.phone, 
          email: employer.email,
          website: profile?.websiteUrl || '',
          profile: profile || null,
        jobsCount: JobCount,
        };
      })
    );

    return NextResponse.json({ employers: employersWithDetails }, { status: 200 });
  } catch (error) {
    console.error("Employer fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
