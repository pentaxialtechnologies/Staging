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
      experience,
      country,
      timezone,
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

    // 📈 Experience Range (min <= actual_experience <= max)
    // Assuming your job documents have 'minExperience' and 'maxExperience' fields
    // and they are stored as numbers in the database.
    // The frontend should send `experience.min` and `experience.max` as strings that can be converted to numbers.

    const minExp = experience?.min ? parseInt(experience.min, 10) : undefined;
    const maxExp = experience?.max ? parseInt(experience.max, 10) : undefined;

    if (!isNaN(minExp!) || !isNaN(maxExp!)) { // Check if at least one is a valid number
        // We're looking for jobs where the job's minExperience is less than or equal to the requested maxExperience,
        // AND the job's maxExperience is greater than or equal to the requested minExperience.
        // This means there's an overlap between the job's experience range and the filter's requested range.

        if (!isNaN(minExp!) && !isNaN(maxExp!)) {
            // Both min and max are provided: find jobs whose range overlaps with [minExp, maxExp]
            query.$and = [
                { "experience.minYears": { $lte: maxExp } }, // Job's min years <= requested max years
                { "experience.maxYears": { $gte: minExp } }  // Job's max years >= requested min years
            ];
        } else if (!isNaN(minExp!)) {
            // Only min is provided: find jobs whose maxExperience is at least the requested minExperience
            query["experience.maxYears"] = { $gte: minExp };
        } else if (!isNaN(maxExp!)) {
            // Only max is provided: find jobs whose minExperience is at most the requested maxExperience
            query["experience.minYears"] = { $lte: maxExp };
        }
    }


    // Fetch jobs from the database
    // Sort by creation date in descending order (newest first)
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