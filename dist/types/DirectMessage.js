"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/DirectMessage.ts
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const DirectMessageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
DirectMessageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    },
});
exports.default = mongoose_1.default.model('DirectMessage', DirectMessageSchema);
