import mongoose, { Model, Schema, Document } from "mongoose";

interface Employers extends Document {
  fullname?: string;
  email?: string;
  password: string;
  role: "employer";
  phone?: string;
  emailVerificationCode?: string | null;
  emailVerified: boolean;
  emailToken: string | null;
  emailTokenExpiresAt: Date | null;
  resetToken: string | undefined;
  resetTokenExpiry: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

const JobSeekerSchema: Schema<Employers> = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employer"],
      default: "employer",
    },
    phone: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      default: null,
    },
    emailToken: {
      type: String,
      default: null,
    },
    emailTokenExpiresAt: { type: Date, default: null },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true },
);

// ✅ FIX HERE
export const Employer: Model<Employers> =
  mongoose.models.Employer ||
  mongoose.model<Employers>("Employer", JobSeekerSchema);
