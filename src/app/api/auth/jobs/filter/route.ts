import { Jobs } from "@/models/ContractJob";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";



export async function GET(req:Request){
    try{
    await dbConnect()
    const {searchParams} = new URL(req.url)
    const skills = searchParams.get('skills')
    const workmode = searchParams.get('workmode')
    const joblocation = searchParams.get('joblocation')
    const timezone = searchParams.get('timezone')
    const payment_schedule = searchParams.get('payment_schedule')
    const employment_type  = searchParams.get('employment_type')
    const engagement_type  = searchParams.get('engagement_type')
    const duration  = searchParams.get('duration')

    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page -1) * limit

    const filter : any ={}

    if(skills){
        filter.skills = {$in: skills.split(',').map((s) => s.trim())}
    }
    if(joblocation) filter.joblocation = joblocation
    
    if(employment_type)filter.employment_type = employment_type
    
    if(payment_schedule) filter.payment_schedule = payment_schedule
    if(engagement_type) filter.engagement_type = engagement_type
    if(duration) filter.duration = duration



    if(timezone) filter.timezone = timezone
    if(workmode) filter.workmode = workmode 


    // const jobs = await Jobs.find(filter)
    const [jobs,total] = await Promise.all([Jobs.find(filter)
        .skip(skip).limit(limit),Jobs.countDocuments(filter)
    ])

     return NextResponse.json({message:'Filtered jobs with pagination',
        jobs,
        total,
        totalPages:Math.ceil(total /limit),
        currentpage:page
     },{status:200});

    }
    catch(error){
    return NextResponse.json({message:'failed to filter',error},{status:500})
        }
}