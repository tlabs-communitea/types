import mongoose, { Types, Schema, Model } from 'mongoose';
import { INotificationDocument } from '../notificationsDTO/types';

export const notificationSchema = new Schema<INotificationDocument>(
  {
    sourceUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['message', 'mention', 'like', 'reply'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read'],
      default: 'unread',
    },
    link: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  }
);

export const NotificationModel: Model<INotificationDocument> = mongoose.model(
  'Notification',
  notificationSchema
);
