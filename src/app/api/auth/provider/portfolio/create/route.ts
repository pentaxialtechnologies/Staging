import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/Mongodb';// Ensure this is correct
import { Provider } from '@/models/Provider/Organization';
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, portfolioItem } = await req.json();

    if (!email || !portfolioItem) {
      return NextResponse.json({ success: false, message: 'Missing email or portfolio data.' }, { status: 400 });
    }

    const updatedProvider = await Provider.findOneAndUpdate(
      { email: email },
      { $push: { portfolio: portfolioItem } }, // Push new portfolio item
      { new: true }
    );

    if (!updatedProvider) {
      return NextResponse.json({ success: false, message: 'Provider not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, provider: updatedProvider });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
