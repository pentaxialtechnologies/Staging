import mongoose, { Schema, Document, Model } from "mongoose";

interface PendingVerificationDoc extends Document {
  email: string;
  emailVerificationCode: string;
  otpExpiresAt: Date;
  emailVerified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const PendingVerificationSchema = new Schema<PendingVerificationDoc>(
  {
    email: { type: String, required: true, unique: true },
    emailVerificationCode: { type: String, required: true, default: "" },
    emailVerified: { type: Boolean, default: false },
    otpExpiresAt: { type: Date, required: true },
    role: { type: String, required: true, enum: ["employer", "jobseeker"] },
  },
  {
    timestamps: true,
  },
);

export const PendingVerification: Model<PendingVerificationDoc> =
  mongoose.models.PendingVerification ||
  mongoose.model<PendingVerificationDoc>(
    "PendingVerification",
    PendingVerificationSchema,
  );
