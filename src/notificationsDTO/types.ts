import mongoose, { Types } from "mongoose";

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

export type NotificationDTO = Omit<
  INotification,
  'targetUserId' | 'updatedAt' | 'createdAt' | 'sourceUserId'
> & {
  sourceUserId: string; // Convert ObjectId to string for DTO
  createdAt: string; // Convert Date to ISO string for DTO
}