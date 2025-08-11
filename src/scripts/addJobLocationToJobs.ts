import 'dotenv/config'


import dbConnect from "../lib/Mongodb";
import { Jobs } from "../models/ContractJob";

async function addJobLocationToJobs() {
  try {
    await dbConnect();

    const result = await Jobs.updateMany(
      {
        $or: [
          { joblocation: { $exists: false } },
          { joblocation: null },
          { joblocation: "" }
        ]
      },
      { $set: { joblocation: "" } } // default value here
    );

    console.log(`✅ Updated ${result.modifiedCount} jobs with joblocation field.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating joblocation:", error);
    process.exit(1);
  }
}

// Run the function
addJobLocationToJobs();
