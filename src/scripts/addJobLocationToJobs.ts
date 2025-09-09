import 'dotenv/config'


import dbConnect from "../lib/Mongodb";
import { Jobs } from "../models/ContractJob";
import { Employers } from '@/models/Employer/Employer';
import { Provider } from '@/models/Provider/Organization';

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


const addStatusToEmployers = async () => {
  try {
    await dbConnect();

    const result = await Employers.updateMany(
      {
        $or: [
          { status: { $exists: false } },
          { status: null },
          { status: "" }
        ]
      },
      { $set: { status: "Active" } } 
    );

    console.log(`✅ Updated ${result.modifiedCount} employers with status field.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating status:", error);
    process.exit(1);
  }
}



const addStatusToProviders = async()=>{
  try{
const result = await Provider.updateMany(
  {
  $or:[
    {status:{$exists: false}},
    {status:null},
    {status:''}
  ]
  },
  {$set:{status:'Active'}}
)

console.log(`Updated ${result.modifiedCount} Provider with Status Field `)
process.exit(0)
  }
  catch(error){
    console.error('Error Updating Status',error);
    process.exit(1)
  }
}

// Run the function
addJobLocationToJobs();
addStatusToEmployers();
addStatusToProviders();
