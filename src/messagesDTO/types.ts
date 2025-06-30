import { Types } from 'mongoose';
import { Document } from 'mongoose';
import { Role } from '../userDTO/types';

export const REASON_FOR_FLAG = {
  SPAM: 'Spam or Unsolicited',
  INAPPROPRIATE: 'Inappropriate Content',
  HARASSMENT: 'Harassment or Bullying',
  MISINFORMATION: 'Misinformation or False Information',
  OTHER: 'Other',
} as const;

export type ReasonForFlag = typeof REASON_FOR_FLAG[keyof typeof REASON_FOR_FLAG];
export interface Flag {
  flaggedBy: Types.ObjectId;
  type: Role; // 'user' or 'admin
  reason: ReasonForFlag;
  createdAt: Date;
}
export interface FlagDTO {
  id?: string;
  flaggedBy: string;
  type: Role;
  reason: ReasonForFlag;
  createdAt: string;
}

export interface Reaction {
  userId: Types.ObjectId;
  emoji: string;
  createdAt: Date;
}

export interface ReactionDTO {
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface IMessage {
  conversationId?: Types.ObjectId;
  userId: Types.ObjectId;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: Date;
  updatedAt: Date;
  likedBy: Types.ObjectId[];
  parentMessageId?: Types.ObjectId;
  replies?: IMessageDocument[];
  metadata: MessageMetadata;
}

export interface IMessageDocument extends Document, IMessage { }

type MongooseSpecificTypes = keyof Document | '_id';
export type CreateMessage = Omit<IMessageDocument, MongooseSpecificTypes | 'createdAt' | 'updatedAt' | 'replies' | 'metadata'> & {
  metadata?: Partial<MessageMetadata>; // Allow partial metadata on create if default is set in schema
};

export type CreateMessageInput = {
  conversationId: string; // Expect string from frontend
  userId: string; // Expect string from frontend
  content?: string;
  fileUrl?: string;
  fileName?: string;
  parentMessageId?: string | null;
  likedBy?: string[];
  metadata?: {
    mentionedUsers?: string[];
    flags?: Omit<FlagDTO, 'createdAt' | 'id' | 'type'>[]; // On creation, client typically just provides reason and flaggedBy. Type and createdAt are server-generated.
  };
};

export interface MessageMetadata {
  flags?: Flag[];
  mentionedUsers?: Types.ObjectId[];
  reactions?: Reaction[];
}

// -----------------
//DTO's for frontend

//metadata
export interface MessageMetadataDTO {
  flags: FlagDTO[]; // Array of FlagDTOs
  mentionedUsers: string[]; // Array of user IDs as strings
  reactions: ReactionDTO[]; // Array of ReactionDTOs
}

//message
export interface MessageDTO {
  id: string; // Mongoose _id as string
  conversationId: string; // Mongoose ObjectId as string
  userId: string; // Mongoose ObjectId as string
  content: string | null; // Content can be null if it's just a file
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  likedBy: string[];
  parentMessageId: string | null; // Mongoose ObjectId as string or null
  metadata: MessageMetadataDTO; // Updated metadata DTO
  replies: MessageDTO[]; // Recursive type for nested replies
}
