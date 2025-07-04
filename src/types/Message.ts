// src/models/Message.ts
import mongoose, { Schema, Document, Types } from 'mongoose';
import { IMessageDocument, MessageMetadata } from '../messagesDTO/types';

export const MessageMetadataSchema = new Schema<MessageMetadata>(
  {
    userFlaggedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    adminFlaggedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    mentionedUsers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
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
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    metadata: {
      type: MessageMetadataSchema,
      default: {},
    },
  },
  { timestamps: true } //auto handle timestamps
);

// Custom validation to ensure either conversationId or channelId is provided
MessageSchema.pre('validate', function (next) {
  if (!this.conversationId) {
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
  (this as mongoose.Query<any, any>).populate('replies');
  next();
});

export default MessageSchema;
