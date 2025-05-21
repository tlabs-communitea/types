import mongoose, { Model, Types, Document } from 'mongoose';

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// This interface represents the shape of the User document in MongoDB
export interface IUser {
  name: string;
  email: string;
  password: string; // Hashed password
  resetPasswordToken?: string; // Note: Mongoose schema uses String, not string
  resetPasswordTokenExpires?: Date;
  avatar?: string;
  description?: string;
  organizationId: Types.ObjectId;
  role: Role;
  organizationAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 

// This interface includes Mongoose Document properties like _id, and methods.
export interface IUserDocument extends IUser, Document {
  // You can add any custom methods for your User model here if needed
  // For example:
  // comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    // Use IUserDocument here
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpires: { type: Date },
    avatar: { type: String },
    description: { type: String },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    organizationAddress: { type: String },
  },
  { timestamps: true }
);

// Transform _id and organizationId to strings for JSON responses
userSchema.set('toJSON', {
  transform: (doc: mongoose.Document<any>, ret: any, options: any) => {
    ret.id = ret._id.toString();
    ret.organizationId = ret.organizationId
      ? ret.organizationId.toString()
      : null;
    ret.createdAt = ret.createdAt ? ret.createdAt.toString() : null;
    ret.updatedAt = ret.updatedAt ? ret.updatedAt.toString() : null;
    ret.description = ret.description ? ret.description.toString() : null;
    ret.avatar = ret.avatar ? ret.avatar.toString() : null;
    ret.organizationAddress = ret.organizationAddress
      ? ret.organizationAddress.toString()
      : null;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Good practice to remove password from JSON output
    return ret; // Ensure you return the modified 'ret' object
  },
});

export default userSchema;
