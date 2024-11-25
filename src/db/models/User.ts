import mongoose, { Document, model, Schema } from "mongoose"

export interface User extends Document {
  chatId: string;
  name: string;
  avatar?: string | null;
  lastAccess: Date;
  isBanned: boolean;
}

const UserSchema = new Schema({
  chatId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  },
  lastAccess: {
    type: Date,
    required: true
  },
  isBanned: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<User>("User", UserSchema);