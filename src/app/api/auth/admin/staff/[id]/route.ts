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
    // No additional code needed here; dbConnect already establishes the connection
    const { id } = await context.params; // ✅ Directly accessing the dynamic route param
    const { isApproved } = await req.json(); // ✅ Receiving the request body
    // Validate input
    if (typeof isApproved !== 'boolean') {
      return NextResponse.json({ message: 'Invalid isApproved value' }, { status: 400 });
    }
    const updated = await BenchStaff.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true } // ✅ Return the updated document
    );

    return NextResponse.json({ message: 'Updated', updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
  }
}
