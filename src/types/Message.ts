// src/models/Message.ts
import mongoose, { Schema, Document, Types } from 'mongoose';
import { IMessageDocument, MessageMetadata } from '../messagesDTO/types';
import { Role } from '../userDTO/types';

export const FlagSchema = new mongoose.Schema({
  flaggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true }); // Keep _id for individual flags for easier referencing if needed

export const MessageMetadataSchema = new Schema(
  {
    flags: {
      type: [FlagSchema],
      default: [],
    },
    mentionedUsers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    reactions: {
        type: [new Schema({
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            emoji: { type: String, required: true }, // e.g., '👍', '❤️', '😂'
            createdAt: { type: Date, default: Date.now }
        }, { _id: false })],
        default: [],
    },
  },
  { _id: false }
);

const MessageSchema = new Schema<IMessageDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: false,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
      required: false,
    },
    fileName: {
      type: String,
      default: '',
      required: false,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    parentMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
      index: true,
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    // Use the redesigned metadata schema
    metadata: {
      type: MessageMetadataSchema,
      default: () => ({ flags: [], mentionedUsers: [], reactions: [] }) // Ensure default initializes new fields
    },
  },
  { timestamps: true } // Mongoose handles createdAt and updatedAt automatically
);

// Custom validation to ensure conversationId is provided
MessageSchema.pre('validate', function (next) {
  if (!this.conversationId) { // Changed this.conversationId check from this.channelId
    next(new Error('ConversationId must be provided.'));
  } else {
    next();
  }
});

// Virtual for replies
MessageSchema.virtual('replies', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'parentMessageId',
});

// Add text index on 'content' only
MessageSchema.index({ content: 'text' });

// Populate virtuals whenever a find query is executed
MessageSchema.pre(/^find/, function (next) {
  // Populate 'replies' and 'metadata.mentionedUsers'
  (this as mongoose.Query<any, any>)
    .populate('replies')
    .populate('metadata.mentionedUsers')
    .populate('metadata.flags.flaggedBy')
    .populate('metadata.reactions.userId');

  next();
});

export default MessageSchema;