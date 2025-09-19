import dbConnect from "@/lib/Mongodb";
import { Proposals } from "@/models/proposal/Proposal";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();

        // Correct way to await and populate
        const proposals = await Proposals.find({ ProviderId: session.user.id }) 
            .populate('JobId','title job_description updatedAt experience.maxyears experience.minyears skills joblocation employment_type workmode timezone engagement_type duration budget availability payment_schedule') 

        console.log('Proposals fetched for user:', session.user.id, proposals);

        if (!proposals || proposals.length === 0) {
            return NextResponse.json({ message: 'No Proposal found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Proposals found", data: proposals },
            { status: 200 }
        );

    } catch (error) {
        console.error('Proposal API Error', error);
        return NextResponse.json(
            { message: 'Server Error', error: error instanceof Error ? error.message : 'Unknown Error' },
            { status: 500 }
        );
    }
}
