import mongoose, { Model, Document } from "mongoose";

interface JobPost extends Document {
  title: string;
  companyId: mongoose.Types.ObjectId;
  employerId: mongoose.Types.ObjectId;
  description: string;
  responsibilities: string[];
  requirements: string[];
  category: mongoose.Types.ObjectId;
  location: {
    city: string;
    state: string;
    country: string;
  };
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "temporary";
  experienceLevel: "entry" | "mid" | "senior" | "manager";
  postedAt: Date;
  expiryDate: Date;
  isActive: boolean;
}

const JobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title required"],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description required"],
    },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    location: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    currency: { type: String, default: "USD" },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "temporary"],
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "manager"],
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    expiryDate: { type: Date },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

JobPostSchema.index({ title: "text", description: "text" });
JobPostSchema.index({ companyId: 1 });
JobPostSchema.index({ category: 1 });
JobPostSchema.index({ "location.city": 1 });

export const Jobposts: Model<JobPost> =
  mongoose.models.Jobposts ||
  mongoose.model<JobPost>("Jobposts", JobPostSchema);
