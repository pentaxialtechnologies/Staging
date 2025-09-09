import dbConnect from "@/lib/Mongodb";
import { NextRequest, NextResponse } from "next/server";
import BenchStaff from "@/models/Provider/BenchStaff";

export async function GET(req:NextRequest){
try{
    await dbConnect()
    const orgId = req.nextUrl.searchParams.get('orgId')
    if(!orgId){
        return NextResponse.json({message:'orgId not found'})
    }
const staff = await BenchStaff.find({OrgId:orgId, isApproved:true}).populate({
    path:'OrgId',
    select:{
    company_name:1,
    'location.city':1,
    'location.state':1,
    companylogo:1
    }
    
});
    
if(!staff){
        return NextResponse.json({message:'orgId not found'})
    }

    return NextResponse.json({ staff }, { status: 200 });
}
catch(error){
    console.error(error);
    
}


}