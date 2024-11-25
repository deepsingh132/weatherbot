import mongoose, { Document, Schema } from "mongoose";

export interface Settings extends Document {
  apiKey: string;
  botToken: string;
  createdAt: Date;
  createdBy: string;
}

const SettingsSchema = new Schema({
  apiKey: { type: String, required: true },
  botToken: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.model<Settings>("Settings", SettingsSchema);
