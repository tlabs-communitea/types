import mongoose, { Types, Schema, Model } from 'mongoose';

export interface INotification {
  sourceUserId: Types.ObjectId; // ID of the user who triggered the notification
  targetUserId: Types.ObjectId; // ID of the user who will receive the notification
  type: 'message' | 'mention' | 'like' | 'reply'; // Type of notification
  title: string; // Title of the notification
  content: string; // Content of the notification
  status: 'unread' | 'read'; // Status of the notification
  createdAt?: Date; // Timestamp when the notification was created
  updatedAt?: Date; // Timestamp when the notification was last updated
  link: string | null; // Optional link to redirect the user when they click the notification
}

export interface INotificationDocument
  extends INotification,
    mongoose.Document {}

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
