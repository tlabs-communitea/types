// src/models/Message.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  channelId?: Types.ObjectId;
  conversationId?: Types.ObjectId;
  userId: Types.ObjectId;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: Date;
  updatedAt: Date;
  likedBy: Types.ObjectId[];
  parentMessageId?: Types.ObjectId;
  replies?: IMessage[]; // Virtual field for replies
}

const MessageSchema = new mongoose.Schema(
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
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      default: null,
      index: true,
    },
    parentMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  { timestamps: true }
);

// Custom validation to ensure either conversationId or channelId is provided
MessageSchema.pre('validate', function (next) {
  if (!this.conversationId && !this.channelId) {
    next(new Error('Either conversationId or channelId must be provided.'));
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

// Ensure virtual fields are serialized
MessageSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.channelId = ret.channelId ? ret.channelId.toString() : null;
    ret.conversationId = ret.conversationId
      ? ret.conversationId.toString()
      : null;
    ret.userId = ret.userId ? ret.userId.toString() : null;
    ret.parentMessageId = ret.parentMessageId
      ? ret.parentMessageId.toString()
      : null;
    ret.likedBy = ret.likedBy.map((id: any) => id.toString());
    ret.content = ret.content.toString() || '';
    ret.fileUrl = ret.fileUrl.toString();
    ret.fileName = ret.fileName.toString();
    ret.createdAt =
      ret.createdAt instanceof Date
        ? ret.createdAt.toISOString()
        : ret.createdAt;
    ret.updatedAt =
      ret.updatedAt instanceof Date
        ? ret.updatedAt.toISOString()
        : ret.updatedAt;
    // Transform replies
    if (ret.replies && Array.isArray(ret.replies)) {
      ret.replies = ret.replies.map((reply: any) => ({
        id: reply._id ? reply._id.toString() : undefined,
        userId: reply.userId ? reply.userId.toString() : null,
        content: reply.content,
        fileUrl: reply.fileUrl,
        fileName: reply.fileName,
        conversationId: reply.conversationId
          ? reply.conversationId.toString()
          : null,
        channelId: reply.channelId ? reply.channelId.toString() : null,
        parentMessageId: reply.parentMessageId
          ? reply.parentMessageId.toString()
          : null,
        createdAt:
          reply.createdAt instanceof Date
            ? reply.createdAt.toISOString()
            : reply.createdAt,
        updatedAt:
          reply.updatedAt instanceof Date
            ? reply.updatedAt.toISOString()
            : reply.updatedAt,
        likes: reply.likes || 0,
      }));
    }
    delete ret._id;
    delete ret.__v;
  },
});

MessageSchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.channelId = ret.channelId ? ret.channelId.toString() : null;
    ret.conversationId = ret.conversationId
      ? ret.conversationId.toString()
      : null;
    ret.userId = ret.userId ? ret.userId.toString() : null;
    ret.parentMessageId = ret.parentMessageId
      ? ret.parentMessageId.toString()
      : null;
    ret.likedBy = ret.likedBy.map((id: any) => id.toString());
    ret.content = ret.content || '';
    ret.fileUrl = ret.fileUrl.toString();
    ret.fileName = ret.fileName.toString();
    ret.createdAt =
      ret.createdAt instanceof Date
        ? ret.createdAt.toISOString()
        : ret.createdAt;
    ret.updatedAt =
      ret.updatedAt instanceof Date
        ? ret.updatedAt.toISOString()
        : ret.updatedAt;
    // Transform replies
    ret.content = ret.content || '';
    // Transform replies
    if (ret.replies && Array.isArray(ret.replies)) {
      ret.replies = ret.replies.map((reply: any) => ({
        id: reply._id ? reply._id.toString() : undefined,
        userId: reply.userId ? reply.userId.toString() : null,
        content: reply.content,
        fileUrl: reply.fileUrl,
        fileName: reply.fileName,
        conversationId: reply.conversationId
          ? reply.conversationId.toString()
          : null,
        channelId: reply.channelId ? reply.channelId.toString() : null,
        parentMessageId: reply.parentMessageId
          ? reply.parentMessageId.toString()
          : null,
        createdAt:
          reply.createdAt instanceof Date
            ? reply.createdAt.toISOString()
            : reply.createdAt,
        updatedAt:
          reply.updatedAt instanceof Date
            ? reply.updatedAt.toISOString()
            : reply.updatedAt,
        likes: reply.likes || 0,
      }));
    }
    delete ret._id;
    delete ret.__v;
  },
});

// Add text index on 'content' only
MessageSchema.index({ content: 'text' });

// Populate virtuals whenever a find query is executed
MessageSchema.pre(/^find/, function (next) {
  (this as mongoose.Query<any, any>).populate('replies');
  next();
});

export default MessageSchema;
