import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { IUserDocument, UserDTO } from '../userDTO/types';

export const TYPE_OF_CHANNEL = {
    channel: 'channel',
    direct: 'direct',
} as const;

export type TYPE_OF_CHANNEL = typeof TYPE_OF_CHANNEL[keyof typeof TYPE_OF_CHANNEL];

export interface IConversation extends Document {
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

export interface ConversationDTO {
    id: string;
    type: TYPE_OF_CHANNEL;
    name: string | null; // Required for channels
    description: string | null; // Optional for channels
    participants: string[]; // Optional for channels
    organizationId: string;
    uniqueKey: string | null; // For direct conversations only
    createdAt: string;
    updatedAt: string;
    archived: boolean; //defaults to false
}