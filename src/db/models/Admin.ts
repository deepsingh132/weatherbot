import mongoose, { Document, model, Schema } from "mongoose";

export interface Admin extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
  lastActive: Date;
  lastAction: string;
  lastActionTime: Date;
  hasAccess: boolean;
}

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    lastAction: {
      type: String,
      default: "None",
    },
    lastActionTime: {
      type: Date,
      default: Date.now,
    },
    hasAccess: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const AdminModel = model<Admin>("Admin", AdminSchema);

export const getAdmins = () => AdminModel.find();
export const getAdminByUsername = (username: string) =>
  AdminModel.findOne({ username });
export const getAdminById = (id: string) => AdminModel.findById(id);
export const getAdminBySessionToken = (sessionToken: string) =>
  AdminModel.findOne({ "authentication.sessionToken": sessionToken });
export const createAdmin = (values: Record<string, any>) =>
  new AdminModel(values).save().then((admin) => admin.toObject());
export const deleteAdminById = (id: string) =>
  AdminModel.findOneAndDelete({ _id: id });
export const updateAdminById = (id: string, values: Record<string, any>) =>
  AdminModel.findByIdAndUpdate(id, values);
