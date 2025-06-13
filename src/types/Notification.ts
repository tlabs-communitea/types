import mongoose, { Types, Schema, Model } from 'mongoose';
import { INotificationDocument, NOTIFICATION_TYPE, NOTIFICATION_STATUS } from '../notificationsDTO/types';

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
      enum: Object.values(NOTIFICATION_TYPE),
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
      enum: Object.values(NOTIFICATION_STATUS),
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
