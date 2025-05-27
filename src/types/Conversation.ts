// src/models/Conversation.ts
import { IConversation } from "../conversationDTO/types";
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'channel'],
      required: true,
    },
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      required: function (this: IConversation) {
        return this.type === 'direct';
      },
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    name: {
      type: String, // Only required for 'channel' type
      required: function (this: IConversation) {
        return this.type === 'channel';
      },
    },
    description: {
      type: String, // Optional for 'channel' type
    },
    uniqueKey: {
      type: String,
      unique: true,
      sparse: true, // Only applicable for direct conversations
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook to set uniqueKey for direct conversations
ConversationSchema.pre('save', function (next) {
  if (this.type === 'direct') {
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
