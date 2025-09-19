import { EmployerProfile } from "@/models/Employer/UserProfile";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function POST(req: Request) {
  try {
     const session = await getServerSession(authOptions);
     if(!session || session.user.role !== 'employer'){
            return NextResponse.json({message:'unauthorized'},{status:401})
     }
    const body = await req.json()
    await dbConnect(); 

    const newCompany = new EmployerProfile({...body,createdBy:session.user.id
    });

    
    await newCompany.save();

    return NextResponse.json(
      { message: "Company Registered successfully", newCompany },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" ,error},
      { status: 500 }
    );
  }
}
