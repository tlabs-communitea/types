import mongoose from 'mongoose';
import { Document } from 'mongoose';

export const TYPE_OF_CHANNEL = {
    channel: 'channel',
    direct: 'direct',
} as const;

export type TYPE_OF_CHANNEL = typeof TYPE_OF_CHANNEL[keyof typeof TYPE_OF_CHANNEL];

export interface IConversationDocument extends Document {
  type: TYPE_OF_CHANNEL;
  name?: string; // Required for channels
  description?: string; // Optional for channels
  participants?: mongoose.Types.ObjectId[]; // Optional for channels
  organizationId: mongoose.Types.ObjectId;
  uniqueKey?: string; // For direct conversations only
  createdAt: Date;
  updatedAt: Date;
  archived: boolean; //defaults to false
}

type MongooseSpecificTypes = keyof Document;
export type CreateConversation = Omit<IConversationDocument, MongooseSpecificTypes>;

export interface ConversationParticipants {
  userId: string;
  name: string;
  avatar: string | null;
  description: string | null;
  email: string;
}

export interface ConversationDTO {
    id: string;
    type: TYPE_OF_CHANNEL;
    name: string | null; // Required for channels
    description: string | null; // Optional for channels
    participants: ConversationParticipants[]; // Optional for channels
    organizationId: string;
    uniqueKey: string | null; // For direct conversations only
    createdAt: string;
    updatedAt: string;
    archived: boolean; //defaults to false
}