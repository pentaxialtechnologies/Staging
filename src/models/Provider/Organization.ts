
  import  { Schema, model, models, Document, Model } from "mongoose";

  // Interfaces
  interface Location {
    city: string;
    state: string;
    country: string;
    postal_code:string
  }

  interface Portfolio {
    title: string;
    thumbnail: string;
    project_link?: string[];
    project_category: string;
    timeline: string;
    project_cost: string;
    screenshot: string;
    description: string;
    isdelete: boolean;
  }

  interface Admin {
    email: string;
    admin_phone: string;
    linkedin_url?: string;
    facebook_url?: string;
    twitter_url?: string;
    google_analytics_id?: string;
  }

  interface Website {
    website_link: string;
    sales_email: string;
  }

  interface ServiceLine {
    category: string;
    serviceline: string;
    percentage: string;
  }

  interface IndustryFocus {
    category: string;
    percentage: string;
  }

  interface ClientSize {
    category: string;
    percentage: string;
  }

  export interface ProviderDocument extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isProfileComplete: boolean;
    companylogo: string;
    company_name: string;
    company_website:string
    min_project_size: string;
    hourly_rate: string;
    size_of_company: string;
    company_founded: string;
    tagline: string;
    summary: string;
    company_location: string;
    location: Location;
    phone_number: number;
    employee_count: string;
    gstno: string;
    service_lines: ServiceLine[];
    industry_focus: IndustryFocus[];
    client_size: ClientSize;
    specialization: string;
    skills: string[];
    portfolio: Portfolio[];
    admin: Admin;
    website: Website;
    emailVerified:boolean
    hasCompletedPlanSelection:boolean
    emailToken:string | null
    emailTokenExpiresAt: Date | null;
    resetToken:  string | undefined,
    resetTokenExpiry: Date | undefined ,
    emailVerificationCode: string
    tempEmail:string
    plan: 'free' | 'growth' | 'business' | 'enterprise';
    planStartedAt: Date;
    planExpiresAt: Date;
    features: {
      jobPostsAllowed: number;
      benchDeployAllowed: boolean;
      teamMembersAllowed: number;
    };
    isPlanActive: boolean;
    role: 'provider';
  }

  // Schema
  const OrganizationSchema = new Schema<ProviderDocument>(
    {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      isProfileComplete: { type: Boolean, default: false },
      company_website:{type:String},
      companylogo: { type: String },
      company_name: { type: String },
      min_project_size: { type: String },
      hourly_rate: { type: String },
      size_of_company: { type: String },
      company_founded: { type: String },
      tagline: { type: String },
      summary: { type: String },
      company_location: { type: String },
      emailVerified:{type:Boolean,default:false},
      emailToken:{type:String,default: null,required: false },
      emailTokenExpiresAt: { type: Date, default: null },
      hasCompletedPlanSelection: {
      type: Boolean,
      default: false,
      },
      resetToken: { type: String },
resetTokenExpiry: { type: Date },
      location: {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postal_code:{type:String},
      },

      phone_number: { type: Number },
      employee_count: { type: String },
      gstno: { type: String },

      service_lines: [
        {
          category: { type: String },
          serviceline: { type: String },
          percentage: { type: String },
        },
      ],

      industry_focus: [
        {
          category: { type: String },
          percentage: { type: String },
        },
      ],

      client_size: {
        category: { type: String },
        percentage: { type: String },
      },

      specialization: { type: String },
      skills: { type: [String], default: [] },

      portfolio: [{
        title: { type: String },
        thumbnail: { type: String },
        project_link: { type: [String], default: [] },
        project_category: { type: String },
        timeline: { type: String },
        project_cost: { type: String },
        screenshot: { type: String },
        description: { type: String },
        isdelete :{type:Boolean, default: false}
      }],

      admin: {
        email: { type: String },
        admin_phone: { type: String },
        linkedin_url: { type: String },
        facebook_url: { type: String },
        twitter_url: { type: String },
        google_analytics_id: { type: String },
      },

      website: {
        website_link: { type: String },
        sales_email: { type: String },
      },
  emailVerificationCode: { type: String },
  tempEmail: { type: String },
      plan: {
        type: String,
        enum: ['free', 'growth', 'business', 'enterprise'],
        default: 'free',
      },
      planStartedAt: {
        type: Date,
        default: Date.now,
      },
      planExpiresAt: {
        type: Date,
        default: null,
      },
      features: {
        jobPostsAllowed: { type: Number, default: 2 },
        benchDeployAllowed: { type: Boolean, default: false },
        teamMembersAllowed: { type: Number, default: 1 },
      },
      isPlanActive: {
        type: Boolean,
        default: true,
      },
      role: {
        type: String,
        enum: ['provider'],
        default:'provider',
      },
    },
    { timestamps: true }
  );



  // Export model
  export const Provider: Model<ProviderDocument> =
    models.Provider || model<ProviderDocument>('Provider', OrganizationSchema);

