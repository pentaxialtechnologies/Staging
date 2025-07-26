  import mongoose,{Model,Document,Schema} from "mongoose";

  interface Application extends Document{
      job: mongoose.Types.ObjectId
      company:mongoose.Types.ObjectId
      resumeUrl:string
      coverLetter:string
      status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected'
      appliedAt: Date
      created_at:Date
      updated_at:Date
  }

  const ApplicationSchema = new Schema({
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    resumeUrl: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interview', 'accepted', 'rejected'],
      default: 'pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },{timestamps:true});

ApplicationSchema.index({job:1,company:1},{unique:true})

  export const Applications :Model<Application> = mongoose.models.Applications || mongoose.model<Application>('Applications',ApplicationSchema)