"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpires: { type: Date },
    avatar: { type: String },
    description: { type: String },
    organizationId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Organization', required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    organizationAddress: { type: String },
}, { timestamps: true });
// Transform _id and organizationId to strings for JSON responses
userSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id.toString();
        ret.organizationId = ret.organizationId ? ret.organizationId.toString() : null;
        ret.createdAt = ret.createdAt ? ret.createdAt.toString() : null;
        ret.updatedAt = ret.updatedAt ? ret.updatedAt.toString() : null;
        ret.description = ret.description ? ret.description.toString() : null;
        ret.avatar = ret.avatar ? ret.avatar.toString() : null;
        ret.organizationAddress = ret.organizationAddress ? ret.organizationAddress.toString() : null;
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Good practice to remove password from JSON output
        return ret; // Ensure you return the modified 'ret' object
    }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
