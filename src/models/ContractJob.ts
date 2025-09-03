  import { mixNumber } from "framer-motion";
  import mongoose, { Schema, Document, Model } from "mongoose";

  interface ContractJob extends Document {
    title: string;
    skills: string[];
    budget: string;
    rate:string;
    duration: string;
    experience: {
      minyears: string;
      maxyears: string;
    };
    availability: string;
    timezone: string;
    workmode: string;
    currency_type: string;
    engagement_type: string;
    payment_schedule: string;
    job_description: string;
    key_responsibilities: string;
    technical_skills: string;
    project_doc: string;
    joblocation:string
    staff_count?: string; 
    plannedStartDate:Date
    keywords: string[];
    postedBy: mongoose.Types.ObjectId;
    status: "under review" | "approved" | "rejected";
    isDeleted : boolean;
    jobPostCount: number;
    createdAt: Date;
    updatedAt: Date;
  }

  const JobSchema  = new Schema<ContractJob>(
    {
      title: { type: String, required: true },
      skills: { type: [String], required: true },
      budget: { type: String, required: true }, 
      rate: { type: String, required: true }, 
      duration: { type: String, required: true },
      staff_count: { type: String, required: true },
      experience: {
        minyears: { type: String, required: true },
        maxyears: { type: String, required: true },
      },
      availability: { type: String, required: true },
      timezone: { type: String, required: true },
      workmode: { type: String, required: true },
      joblocation: { type: String ,default:''},
      engagement_type: { type: String, required: true },  
      payment_schedule: { type: String, required: true },
      currency_type: { type: String, required: true },
      job_description: { type: String, required: true },
      key_responsibilities: { type: String, required: true },
      technical_skills: { type: String, required: true },
      project_doc: { type: String },
      plannedStartDate: { type: Date },
      keywords: { type: [String], index: true, default: [] },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employers",
        required: true,
      },
      jobPostCount: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ["under review", "approved", "rejected"],
        default: "under review",
      },
      isDeleted:{type:Boolean, default:false},
    },
    { timestamps: true }
  );

  JobSchema.index({
    title: "text",
    job_description: "text",
    skills: "text",
    joblocation:'text',
    technical_skills: "text",
    key_responsibilities: "text",
    keywords: "text",
  });

  JobSchema.index({
    skills:1,joblocation:1,employment_type:1,workmode: 1,
    timezone: 1,engagement_type:1,duration:1,
    currency_type: 1
  })


  JobSchema.pre("save", function (next) {
    const job = this as ContractJob;

    const keywordSources = [
      job.title,
      job.budget,
      job.duration,
      job.availability,
      job.timezone,
      job.workmode,
      job.engagement_type,
      job.payment_schedule,
      job.experience.minyears,
      job.experience.maxyears,
      ...(job.skills || []),
      ...(job.key_responsibilities || []),
      ...(job.technical_skills || []),
    ];

    job.keywords = Array.from(
      new Set(
        keywordSources
          .filter(Boolean)
          .flatMap((kw) => kw.split(/[ ,;]+/))
          .map((kw) => kw.toLowerCase().trim())
      )
    );

    next();
  });   


  export const Jobs: Model<ContractJob> =
    mongoose.models.Jobs || mongoose.model<ContractJob>("Jobs", JobSchema);
