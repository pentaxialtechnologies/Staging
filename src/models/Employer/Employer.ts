import mongoose, { Model, Schema, Document } from 'mongoose';

interface EmployerDocument extends Document {
  fullname: string;
  email: string;
  password: string;
  role: 'employer';
  phone: string;
  emailVerificationCode?: string;
  tempEmail?: string;
  emailToken?: string | null;
  emailTokenExpiresAt?: Date | null;
  resetToken?: string;
  resetTokenExpiry?: Date;
  status:'Active' | 'InActive' | 'Suspended';
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmployerSchema: Schema<EmployerDocument> = new Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['employer'],
      default: 'employer',
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    emailVerificationCode: {
      type: String,
      default: ''
    },
    tempEmail: {
      type: String,
      default: ''
    },
    emailToken: {
      type: String,
      default: null
    },
    emailTokenExpiresAt: {
      type: Date,
      default: null
    },
    resetToken: {
      type: String,
      default: ''
    },
    resetTokenExpiry: {
      type: Date,
      default: null
    },
    lastActiveAt:{
      type:Date
    },
    status: {
      type: String,
      enum: ['Active', 'InActive', 'Suspended'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

export const Employers: Model<EmployerDocument> =
  mongoose.models.Employers || mongoose.model<EmployerDocument>('Employers', EmployerSchema);
