import mongoose, { Schema, Document } from "mongoose";
import { User } from "./User";

interface Subscription extends Document {
  userId: User;
  location: string;
  frequency: 'hourly' | 'daily' | 'weekly' ; // 'minutely';
  lastSent?: Date;
}

const SubscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    frequency: { type: String, enum: ['hourly', 'daily', 'weekly'], required: true },
    lastSent: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Subscription>("Subscription", SubscriptionSchema);
