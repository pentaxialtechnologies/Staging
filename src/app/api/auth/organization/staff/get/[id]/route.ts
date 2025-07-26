import dbConnect from '@/lib/Mongodb';
import { NextResponse } from 'next/server';
import BenchStaff from '@/models/Provider/BenchStaff';

type RouteContexts = { params :Promise<{id :string}>}

export async function GET(req:Request,context:RouteContexts){
try{
    await dbConnect()
    const {id} = await context.params; // ✅ Directly accessing the dynamic route param
const staff = await BenchStaff.findById(id)
    if(!staff){
    return NextResponse.json({message:'Staff Not Found'})
    }

    return NextResponse.json({staff})
}
catch(error){
    return NextResponse.json({message:'Internal Server Error',error})
}
}