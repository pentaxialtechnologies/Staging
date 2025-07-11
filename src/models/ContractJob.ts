import mongoose, { Schema, Document, Model } from "mongoose";

export interface ContractJob extends Document {
  title: string;
  skills: string[];
  budget: string;
  rate: string;
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
  payment_mode: string;
  job_description: string;
  key_responsibilities: string[];
  technical_skills: string[];
  project_doc: string;
  working_days: {
    start_day: string;
    end_day: string;
  };
  working_hours: {
    start_time: string;
    end_time: string;
  };
  job_dates: {
    start_date: string;
    // end_date: string;
  };
  location: {
    city: string;
    state?: string;
    country: string;
  };
  keywords: string[];
  postedBy: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<ContractJob>(
  {
    title: { type: String, required: true },
    skills: { type: [String], required: true },
    budget: { type: String, required: true }, // ✅ Added
    rate: { type: String, required: true },
    duration: { type: String, required: true },
    experience: {
      minyears: { type: String, required: true },
      maxyears: { type: String, required: true },
    },
    availability: { type: String, required: true },
    timezone: { type: String, required: true },
    workmode: { type: String, required: true },
    engagement_type: { type: String, required: true },
    payment_schedule: { type: String, required: true },
    payment_mode: { type: String},
    currency_type: { type: String, required: true },
    job_description: { type: String, required: true },
    key_responsibilities: { type: [String], required: true },
    technical_skills: { type: [String], required: true },
    project_doc: { type: String },
    working_days: {
      start_day: { type: String, required: true },
      end_day: { type: String, required: true },
    },
    working_hours: {
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
    },
    job_dates: {
      start_date: { type: String, required: true },
      // end_date: { type: String, required: true }, // ✅ Fixed back
    },
    location: {
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
    },
    keywords: { type: [String], index: true, default: [] },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ✅ Text Index
JobSchema.index({
  title: "text",
  job_description: "text",
  skills: "text",
  technical_skills: "text",
  key_responsibilities: "text",
  keywords: "text",
});

// ✅ Keyword Preprocessing
JobSchema.pre("save", function (next) {
  const job = this as ContractJob;

  const keywordSources = [
    job.title,
    job.budget,
    job.rate,
    job.duration,
    job.availability,
    job.timezone,
    job.workmode,
    job.engagement_type,
    job.payment_schedule,
    job.location.city,
    job.location.state || "",
    job.location.country,
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
