import mongoose,{Model,Document} from "mongoose";


interface ApplyContractJobs extends Document{
    jobId:mongoose.Types.ObjectId,
    seekerId:mongoose.Types.ObjectId,
    coverletter:string,
    appliedAt:Date
}
const ApplyContractJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContractJob",
    required: true,
  },
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobSeeker",
    required: true,
  },
  coverLetter: String,
  appliedAt: { type: Date, default: Date.now },
});


export const ApplyContractJob :Model<ApplyContractJobs> = mongoose.models.ApplyContractJob || mongoose.model<ApplyContractJobs>('ApplyContractjob',ApplyContractJobSchema)