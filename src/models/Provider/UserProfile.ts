import mongoose, { Document, Schema, Types } from "mongoose";

interface UserProfileType extends Document {
  userId: Types.ObjectId;
  userprofile: string;
  username: string;
  headline: string;
  industry: string;
  public_profile_url: string;
}

const UserSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    userprofile: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
    },
    industry: {
      type: String,
    },
    public_profile_url: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.UserProfile ||
  mongoose.model<UserProfileType>("UserProfile", UserSchema);
