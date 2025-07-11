import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import BenchStaff from "@/models/Provider/BenchStaff";

export async function GET() {
  try {
    await dbConnect();
    const staff = await BenchStaff.find({ isApproved: true }).populate({
      path: "OrgId",
      select: "company_name",
    });

    //Group staff by OrgId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grouped = staff.reduce((acc: any, staffMember: any) => {
      const orgId = staffMember.OrgId?._id;
      if (!orgId) {
        return acc;
      }

      if (!acc[orgId]) {
        acc[orgId] = {
          orgId: orgId,
          company_name: staffMember.OrgId.company_name,
          staff: [],
        };
      }

      acc[orgId].staff.push(staffMember);
      return acc;
    }, {});

    return NextResponse.json(
      { organizations: Object.values(grouped) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 },
    );
  }
}
