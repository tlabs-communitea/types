// src/models/Conversation.ts
import { IConversationDocument } from "../conversationDTO/types";
import mongoose from "mongoose";
import { TYPE_OF_CHANNEL } from "../conversationDTO/types";
const ConversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: TYPE_OF_CHANNEL,
      required: true,
    },
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      required: function (this: IConversationDocument) {
        return this.type === TYPE_OF_CHANNEL.direct;
      },
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    name: {
      type: String, // Only required for 'channel' type
      required: function (this: IConversationDocument) {
        return this.type === TYPE_OF_CHANNEL.channel;
      },
    },
    description: {
      type: String,
    },
    uniqueKey: {
      type: String,
      unique: true,
      sparse: true, // Only applicable for direct conversations
    },
    metadata: {
      adminFlaggedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: [], // Default to an empty array
        }
      ],
      adminHidden: {
        type: Boolean,
        default: false,
      },
      default: {}, // Ensure metadata always exists
    },
  },
  { timestamps: true }
);

// Pre-save hook to set uniqueKey for direct conversations
ConversationSchema.pre('save', function (next) {
  if (this.type === TYPE_OF_CHANNEL.direct) {
    // Sort participant IDs to ensure consistency
    const sortedParticipants = this.participants
      .map((id) => id.toString())
      .sort();
    this.uniqueKey = sortedParticipants.join('_');
  }
  next();
});

// Add unique index on uniqueKey and organizationId
ConversationSchema.index(
  { uniqueKey: 1, organizationId: 1 },
  { unique: true, sparse: true }
);

// // Add toJSON transformation to include 'id' field and remove '_id'
// ConversationSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) {
//     ret.id = ret._id.toString();
//     delete ret._id;
//     delete ret.__v;
//   },
// });

export default ConversationSchema;
