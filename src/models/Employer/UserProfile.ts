  import mongoose, { Document, Model, Schema } from "mongoose";

  interface CompanyLocation {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }

  export interface CompanyData extends Document {
    firstname: string;
    lastname:string;
    companyname:string;
    websiteUrl: string;
    phone:number;
    description: string;
    gstno: string;
    industry: string;
    strength: string;
    location: CompanyLocation;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

  const CompanySchema = new Schema<CompanyData>(
    {
      firstname: {
        type: String,
        required: [true, "Company name required"],
        trim: true,
        maxlength: 100,
        
      },
      lastname: {
        type: String,
        required: [true, "Company name required"],
        trim: true,
        maxlength: 100,
        
      },
        companyname: {
        type: String,
        required: [true, "Company name required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
        
      },
      websiteUrl: {
        type: String,
        trim: true,
        validate: {
          validator: (v: string) =>
            !v ||
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(v),
          message: (props) => `${props.value} is an invalid URL`,
        },
      },
      phone:{type:Number},
      gstno: { type: String },
      strength: { type: String },
      industry: { type: String },
      description: { type: String, trim: true, maxlength: 2000 },
      location: {
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        postalCode: { type: String, trim: true },
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employers",
        required: true,
      },
    },
    { timestamps: true }
  );


  export const EmployerProfile: Model<CompanyData> =
    mongoose.models.EmployerProfile || mongoose.model<CompanyData>("EmployerProfile", CompanySchema);
