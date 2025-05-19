"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/MessageHistory.js
const mongoose_1 = __importDefault(require("mongoose"));
const MessageHistorySchema = new mongoose_1.default.Schema({
    messageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
    },
    operation: {
        type: String,
        enum: ['create', 'update', 'delete'],
        required: true,
    },
    before: {
        type: mongoose_1.default.Schema.Types.Mixed,
    },
    after: {
        type: mongoose_1.default.Schema.Types.Mixed,
    },
    modifiedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('MessageHistory', MessageHistorySchema);
