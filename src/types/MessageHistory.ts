// models/MessageHistory.js
import mongoose, { Schema, Document } from 'mongoose';


const MessageHistorySchema = new mongoose.Schema(
    {
        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
        },
        operation: {
            type: String,
            enum: ['create', 'update', 'delete'],
            required: true,
        },
        before: {
            type: mongoose.Schema.Types.Mixed,
        },
        after: {
            type: mongoose.Schema.Types.Mixed,
        },
        modifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('MessageHistory', MessageHistorySchema);
