import { Types } from 'mongoose';
import { Document } from 'mongoose';

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
  replies?: IMessageDocument[]; // Virtual field for replies, populated only after a find query, doesn't exist separately in the db 
  //NOTE: Don't use .lean() with replies populating, fetch replies fully as IMessageDocument[], else typeError will occur when using transformToMessageDTO function, as it expects IMessageDocument type for replies
  metadata?: MessageMetadata; // Optional metadata field
}

export interface IMessageDocument extends Document, IMessage {}

type MongooseSpecificTypes = keyof Document;
export type CreateMessage = Omit<IMessageDocument, MongooseSpecificTypes>;

export interface MessageMetadata {
  userFlaggedBy: Types.ObjectId[];
  adminFlaggedBy: Types.ObjectId[];
}

// -----------------
//DTO's for frontend

//metadata
export interface MessageMetadataDTO {
  userFlaggedBy: string[];
  adminFlaggedBy: string[];
}

//message
export interface MessageDTO {
  id: string;
  conversationId: string | null;
  userId: string | null;
  content: string;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
  updatedAt: string;
  likedBy: string[];
  parentMessageId: string | null;
  metadata: MessageMetadataDTO | null;
  replies: MessageDTO[];
}
