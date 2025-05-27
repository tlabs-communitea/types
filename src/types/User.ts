import mongoose from 'mongoose';
import { IUserDocument, ROLES } from '../userDTO/types';

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
    role: { type: String, enum: ROLES, default: ROLES.MEMBER },
    organizationAddress: { type: String },
  },
  { timestamps: true }
);

// // Transform _id and organizationId to strings for JSON responses
// userSchema.set('toJSON', {
//   transform: (doc: mongoose.Document<any>, ret: any, options: any) => {
//     ret.id = ret._id.toString();
//     ret.organizationId = ret.organizationId
//       ? ret.organizationId.toString()
//       : null;
//     ret.createdAt = ret.createdAt ? ret.createdAt.toString() : null;
//     ret.updatedAt = ret.updatedAt ? ret.updatedAt.toString() : null;
//     ret.description = ret.description ? ret.description.toString() : null;
//     ret.avatar = ret.avatar ? ret.avatar.toString() : null;
//     ret.organizationAddress = ret.organizationAddress
//       ? ret.organizationAddress.toString()
//       : null;
//     delete ret._id;
//     delete ret.__v;
//     delete ret.password; // Good practice to remove password from JSON output
//     return ret; // Ensure you return the modified 'ret' object
//   },
// });

export default userSchema;
