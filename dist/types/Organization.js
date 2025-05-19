"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/types/Organization.ts
const mongoose_1 = __importDefault(require("mongoose"));
const organizationSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
}, { timestamps: true });
// Transform _id to string
organizationSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});
const Organization = mongoose_1.default.model('Organization', organizationSchema);
exports.default = Organization;
