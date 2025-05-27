// src/types/Organization.ts
import mongoose, { Document, Model } from 'mongoose';
import { IOrganization, IOrganizationDocument } from '../organizationDTO/types';

const organizationSchema = new mongoose.Schema<IOrganizationDocument>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// // Transform _id to string
// organizationSchema.set('toJSON', {
//   transform: (doc: mongoose.Document<any>, ret: any, options: any) => {
//     ret.id = ret._id.toString();
//     delete ret._id;
//     delete ret.__v;
//   },
// });

export default organizationSchema;
