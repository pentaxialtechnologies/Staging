import { Provider } from "@/models/Provider/Organization";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import BenchStaff from "@/models/Provider/BenchStaff";

export async function GET(){
    try{

const providers = await Provider.find()
// const providers = await Provider.find().select('_id firstname lastname email company_name admin.admin_phone  admin.email website.website_link')



if(!providers){
    return NextResponse.json({message:'Provider List is Empty'},{status:404})
}

const ProviderDetails = await Promise.all(
    providers.map(async (prov)=>{
    const benchstaffs = await BenchStaff.countDocuments({OrgId:prov._id}).lean()
    return {
        _id:prov._id,
        firstname:prov.firstname,
        lastname:prov.lastname,
        email:prov.email,
        phone:prov.phone_number,
        adminphone:prov.admin.admin_phone,
        adminemail:prov.admin.email,
        website:prov.website.website_link,
        companyname:prov.company_name,
        employee_count:prov.employee_count,
        size_of_company:prov.size_of_company,
        status:prov.status,
        StaffCount:benchstaffs
    }
    })
)

return NextResponse.json({ProviderDetails})
    }
    catch(error){
        return NextResponse.json({message:'Server Error'},{status:500})
    }
}