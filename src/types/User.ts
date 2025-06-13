import mongoose from 'mongoose';
import {
  IUserDocument,
  REASON_FOR_LOCK,
  ReasonForLock,
  ROLES,
} from '../userDTO/types';

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
    role: { type: String, enum: Object.values(ROLES), default: ROLES.MEMBER },
    organizationAddress: { type: String },
    isLocked: { type: Boolean, default: false }, // indicates if the user account is locked by the admin
    reasonForLock: {
      type: String,
      enum: Object.values(REASON_FOR_LOCK),
      default: REASON_FOR_LOCK.UNLOCKED,
      validate: {
        validator: function (value: ReasonForLock) {
          // If the user is locked, reasonForLock must not be null/undefined/'unlocked'
          if (this.isLocked && value === REASON_FOR_LOCK.UNLOCKED) {
            return false;
          }
          // value must be one of the allowed enum values
          return Object.values(REASON_FOR_LOCK).includes(value);
        },
        message: (props: any) =>
          `${props.value} is not a valid reason for locking the user account.`,
      },
    },
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
