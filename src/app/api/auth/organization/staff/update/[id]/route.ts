import dbConnect from '@/lib/Mongodb';
import { NextResponse } from 'next/server';
import BenchStaff from '@/models/Provider/BenchStaff';

type RouteContexts = { params :Promise<{id :string}>}

export async function PUT(req:Request,context: RouteContexts){
    try{
        await dbConnect()
        const {id} = await context.params
        const body = await req.json()
        const staff = await BenchStaff.findByIdAndUpdate(id,{...body},{new: true})
        return NextResponse.json({message:'Updated',staff})
   
    }
    catch(error){
    return NextResponse.json({message:'Internal Server Error',error})
    }
}