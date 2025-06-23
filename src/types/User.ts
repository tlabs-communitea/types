import mongoose from 'mongoose';
import {
  IUserDocument,
  REASON_FOR_LOCK,
  ReasonForLock,
  ROLES,
  GENDER,
  SEXUALITY,
  RELATIONSHIP_STATUS,
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
          //when locked, unlocked is not a valid reason
          if (this.isLocked) {
            return value !== REASON_FOR_LOCK.UNLOCKED;
          }
          //when not locked, unlocked is the only valid reason
          return value === REASON_FOR_LOCK.UNLOCKED;
        },
        message: (props: any) =>
          `${props.value} is not a valid reason for locking the user account.`,
      },
    },
    metadata: {
      type: {
        interests: { type: [String], default: [] },
        prompts: {
          type: [
            {
              question: { type: String },
              answer: { type: String },
            },
          ],
          default: [],
        },
        pronouns: { type: String, default: '' },
        lifeSituation: { type: String, default: '' },
        work: { type: String, default: '' },
        education: { type: String, default: '' },
        gender: { type: String, enum: Object.values(GENDER), default: '' },
        lookingFor: { type: String, default: '' },
        sexuality: { type: String, enum: Object.values(SEXUALITY), default: '' },
        relationshipStatus: { type: String, enum: Object.values(RELATIONSHIP_STATUS), default: '' },
        hasKids: { type: Boolean, default: null },
        religion: { type: String, default: '' },
        smoking: { type: Boolean, default: null },
        drinking: { type: Boolean, default: null },
        newToArea: { type: Boolean, default: null },
        starSign: { type: String, default: '' },
        pets: { type: Boolean, default: null },
      },
      required: false,
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
