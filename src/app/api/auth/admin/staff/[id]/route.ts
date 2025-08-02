import dbConnect from '@/lib/Mongodb';
import BenchStaff from '@/models/Provider/BenchStaff';
import { NextResponse } from 'next/server';


export type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(
  req: Request,
 context: RouteContext
) {
  try {
    await dbConnect();
   
    const { id } = await context.params; 
    const { isApproved } = await req.json(); 
    // Validate input
    if (typeof isApproved !== 'boolean') {
      return NextResponse.json({ message: 'Invalid isApproved value' }, { status: 400 });
    }
    const updated = await BenchStaff.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true } 
    );

    return NextResponse.json({ message: 'Updated', updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
  }
}
