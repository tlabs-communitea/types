"use strict";
// src/models/Conversation.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ConversationSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ['direct', 'channel'],
        required: true,
    },
    participants: {
        type: [{
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
            }],
        required: function () { return this.type === 'direct'; },
    },
    organizationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    name: {
        type: String, // Only required for 'channel' type
        required: function () { return this.type === 'channel'; },
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
}, { timestamps: true });
// Pre-save hook to set uniqueKey for direct conversations
ConversationSchema.pre('save', function (next) {
    if (this.type === 'direct') {
        // Sort participant IDs to ensure consistency
        const sortedParticipants = this.participants.map(id => id.toString()).sort();
        this.uniqueKey = sortedParticipants.join('_');
    }
    next();
});
// Add unique index on uniqueKey and organizationId
ConversationSchema.index({ uniqueKey: 1, organizationId: 1 }, { unique: true, sparse: true });
// Add toJSON transformation to include 'id' field and remove '_id'
ConversationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    },
});
exports.default = mongoose_1.default.model('Conversation', ConversationSchema);
