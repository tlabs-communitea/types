import mongoose, { Model, Types, Document } from 'mongoose';

export interface IPushToken {
  userId: Types.ObjectId;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPushTokenDocument extends IPushToken, Document { }

export const pushTokenSchema = new mongoose.Schema<IPushTokenDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // automatically handles createdAt and updatedAt
  }
);

export const PushTokenModel: Model<IPushTokenDocument> = mongoose.model(
  'PushToken',
  pushTokenSchema
);
