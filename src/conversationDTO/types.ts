import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { PublicUserDTO } from '../userDTO/types';

export const TYPE_OF_CHANNEL = {
  channel: 'channel',
  direct: 'direct',
} as const;

export type TYPE_OF_CHANNEL =
  (typeof TYPE_OF_CHANNEL)[keyof typeof TYPE_OF_CHANNEL];

export interface IConversation {
  type: TYPE_OF_CHANNEL;
  name?: string; // Required for channels
  description?: string; // Optional for channels
  participants?: mongoose.Types.ObjectId[]; // Optional for channels
  organizationId: mongoose.Types.ObjectId;
  uniqueKey?: string; // For direct conversations only
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    adminFlaggedBy?: mongoose.Types.ObjectId[]; // Array of user IDs who flagged the conversation
    adminHidden?: boolean;
  };
}

export interface IConversationDocument extends Document, IConversation { }

type MongooseSpecificTypes = keyof Document;
export type CreateConversation = Omit<
  IConversationDocument,
  MongooseSpecificTypes
>;

export interface ConversationDTO {
  id: string;
  type: TYPE_OF_CHANNEL;
  name: string | null; // Required for channels
  description: string | null;
  participants: string[]; // // Array of user IDs. Optional for channels
  organizationId: string;
  uniqueKey: string | null; // For direct conversations only
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  metadata: {
    adminFlaggedBy: string[]; // Array of user IDs who flagged the conversation
    adminHidden: boolean;
  };
}

export interface ConversationDetailsDTO {
  id: string;
  name: string | null;
  description: string | null;
  members: PublicUserDTO[];
  admin: PublicUserDTO;
}
