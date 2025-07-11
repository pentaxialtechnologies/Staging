// models/Staff.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStaff extends Document {
  OrgId: Types.ObjectId;
  primarySkills: string;
  skills: string[];
  designation: string;
  numberBenchStaff: string;
  averageExperience: string;
  rate: string;
  rateType: string;
  availability: string;
  inDirectMessage: boolean;
  engagementType: string;
  workFrom: string;
  availableAtClientLocation: string;
  keywords: string[];
}

const StaffSchema: Schema = new Schema(
  {
    OrgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
    },
    primarySkills: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    designation: {
      type: String,
      required: true,
    },
    numberBenchStaff: {
      type: String,
      required: true,
    },
    averageExperience: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    rateType: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      required: true,
    },
    inDirectMessage: {
      type: Boolean,
      default: false,
    },
    engagementType: {
      type: String,
      required: true,
    },
    workFrom: {
      type: String,
      required: true,
    },
    availableAtClientLocation: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      index: true,
      default: [],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

StaffSchema.pre<IStaff>("save", function (next) {
  const keywordSet = new Set<string>();
  this.skills?.forEach((skill) => keywordSet.add(skill.toLocaleLowerCase()));
  if (this.primarySkills) keywordSet.add(this.primarySkills.toLowerCase());
  if (this.designation) keywordSet.add(this.designation.toLowerCase());
  if (this.availability) keywordSet.add(this.availability.toLowerCase());
  if (this.engagementType) keywordSet.add(this.engagementType.toLowerCase());
  if (this.workFrom) keywordSet.add(this.workFrom.toLowerCase());

  this.keywords = Array.from(keywordSet);
  next();
});

export default mongoose.models.CompanyStaff ||
  mongoose.model<IStaff>("CompanyStaff", StaffSchema);
