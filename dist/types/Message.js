"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Message.ts
const mongoose_1 = __importStar(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
    },
    channelId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Channel',
        default: null,
        index: true,
    },
    parentMessageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message',
        default: null,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    likedBy: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
}, { timestamps: true });
// Custom validation to ensure either conversationId or channelId is provided
MessageSchema.pre('validate', function (next) {
    if (!this.conversationId && !this.channelId) {
        next(new Error('Either conversationId or channelId must be provided.'));
    }
    else {
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
        ret.conversationId = ret.conversationId ? ret.conversationId.toString() : null;
        ret.userId = ret.userId ? ret.userId.toString() : null;
        ret.parentMessageId = ret.parentMessageId ? ret.parentMessageId.toString() : null;
        ret.likedBy = ret.likedBy.map((id) => id.toString());
        ret.content = ret.content.toString() || '';
        ret.fileUrl = ret.fileUrl.toString();
        ret.fileName = ret.fileName.toString();
        ret.createdAt = ret.createdAt instanceof Date ? ret.createdAt.toISOString() : ret.createdAt;
        ret.updatedAt = ret.updatedAt instanceof Date ? ret.updatedAt.toISOString() : ret.updatedAt;
        // Transform replies
        if (ret.replies && Array.isArray(ret.replies)) {
            ret.replies = ret.replies.map((reply) => ({
                id: reply._id ? reply._id.toString() : undefined,
                userId: reply.userId ? reply.userId.toString() : null,
                content: reply.content,
                fileUrl: reply.fileUrl,
                fileName: reply.fileName,
                conversationId: reply.conversationId ? reply.conversationId.toString() : null,
                channelId: reply.channelId ? reply.channelId.toString() : null,
                parentMessageId: reply.parentMessageId ? reply.parentMessageId.toString() : null,
                createdAt: reply.createdAt instanceof Date ? reply.createdAt.toISOString() : reply.createdAt,
                updatedAt: reply.updatedAt instanceof Date ? reply.updatedAt.toISOString() : reply.updatedAt,
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
        ret.conversationId = ret.conversationId ? ret.conversationId.toString() : null;
        ret.userId = ret.userId ? ret.userId.toString() : null;
        ret.parentMessageId = ret.parentMessageId ? ret.parentMessageId.toString() : null;
        ret.likedBy = ret.likedBy.map((id) => id.toString());
        ret.content = ret.content || '';
        ret.fileUrl = ret.fileUrl.toString();
        ret.fileName = ret.fileName.toString();
        ret.createdAt = ret.createdAt instanceof Date ? ret.createdAt.toISOString() : ret.createdAt;
        ret.updatedAt = ret.updatedAt instanceof Date ? ret.updatedAt.toISOString() : ret.updatedAt;
        // Transform replies
        ret.content = ret.content || '';
        // Transform replies
        if (ret.replies && Array.isArray(ret.replies)) {
            ret.replies = ret.replies.map((reply) => ({
                id: reply._id ? reply._id.toString() : undefined,
                userId: reply.userId ? reply.userId.toString() : null,
                content: reply.content,
                fileUrl: reply.fileUrl,
                fileName: reply.fileName,
                conversationId: reply.conversationId ? reply.conversationId.toString() : null,
                channelId: reply.channelId ? reply.channelId.toString() : null,
                parentMessageId: reply.parentMessageId ? reply.parentMessageId.toString() : null,
                createdAt: reply.createdAt instanceof Date ? reply.createdAt.toISOString() : reply.createdAt,
                updatedAt: reply.updatedAt instanceof Date ? reply.updatedAt.toISOString() : reply.updatedAt,
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
    this.populate('replies');
    next();
});
exports.default = mongoose_1.default.model('Message', MessageSchema);
