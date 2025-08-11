import { Jobs } from "@/models/ContractJob";
import dbConnect from "../lib/Mongodb";

export async function InitServer(){
        await dbConnect()

try{

    const result = await Jobs.updateMany(
        {joblocation : {$exists : false}},
        {$set :{joblocation:''}}
    )

    if(result.modifiedCount > 0){
        console.log(`Added Joblocation  to ${result.modifiedCount} old jobs`);
        
    }
    else{
         console.log("ℹ️ All jobs already have joblocation");
    }
}
catch(error){
console.error(error);
            
        }
}