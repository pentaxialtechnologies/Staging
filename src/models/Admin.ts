import mongoose, { Schema, Model, Document } from 'mongoose';

export interface AdminDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: 'jobseeker' | 'provider' | 'admin' | 'company';

  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<AdminDocument>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['jobseeker', 'provider', 'admin', 'company'],
      default: 'admin',
    },
     
  },
  { timestamps: true }
);

// AdminSchema.index({ email: 1 }, { unique: true });

export const Admin: Model<AdminDocument> =
  mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', AdminSchema);
