// /app/api/jobs/search/route.ts
import dbConnect from "@/lib/Mongodb";
import { Jobs } from "@/models/ContractJob"; // Ensure this path is correct
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect(); // Connect to your MongoDB database

    // Parse the request body as JSON. Provide a default empty object if body is empty.
    const {
      keyword,
      workmode,
      country,
      timezone,
      engagement_type
    } = await req.json();
    
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { status: "approved" }; // Always filter for approved jobs

    // 🔍 Text search (requires a text index on your MongoDB collection)
    // Example: db.jobs.createIndex({ title: "text", description: "text", skills: "text" })
    if (keyword && typeof keyword === 'string' && keyword.trim() !== '') {
      query.$text = { $search: keyword.trim() }; // Trim whitespace
    }

    // 🏢 Work Mode (e.g., Remote, On-site, Hybrid)
    if (workmode && typeof workmode === 'string' && workmode.trim() !== '' && workmode.toLowerCase() !== 'any') {
      // Use a case-insensitive regex for flexibility, or ensure frontend sends exact match
      query.workmode = new RegExp(`^${workmode.trim()}$`, 'i');
      // If workmode in DB is strictly lowercase, you can use:
      // query.workmode = workmode.trim().toLowerCase();
    }

    // 🌐 Country
    if (country && typeof country === 'string' && country.trim() !== '') {
      query["location.country"] = new RegExp(`^${country.trim()}$`, 'i'); // Case-insensitive exact match
    }

    // 🕰️ Timezone
    if (timezone && typeof timezone === 'string' && timezone.trim() !== '') {
      query.timezone = new RegExp(timezone.trim(), 'i'); // Case-insensitive partial match
    }

  
  
  
    const jobs = await Jobs.find(query).sort({ createdAt: -1 });

    // Return the jobs in a structured JSON response
    return NextResponse.json({ jobs: jobs }, { status: 200 });

  } // eslint-disable-next-line @typescript-eslint/no-explicit-any
   catch (error: any) {
    console.error("API Search Error:", error); // Log detailed error on the server
    return NextResponse.json(
      { message: "Search failed", error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}