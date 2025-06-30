// src/messagesDTO/MessageTransform.ts

import { Types } from 'mongoose';
import type { MessageDTO, IMessageDocument, MessageMetadataDTO, FlagDTO, ReactionDTO } from '../messagesDTO/types'; // Import FlagDTO and ReactionDTO

// Helper function for converting ObjectId arrays to string arrays
function mapObjectIdsToStrings(
  ids: Types.ObjectId[] | null | undefined
): string[] {
  return Array.isArray(ids) ? ids.map((id) => id.toString()) : [];
}

// Helper function to transform a single Flag from the Mongoose document to FlagDTO
function transformToFlagDTO(flag: any): FlagDTO { // 'any' here assumes it's the raw Mongoose subdocument
    return {
        flaggedBy: flag.flaggedBy ? flag.flaggedBy.toString() : '', // Assuming 'flaggedBy' is populated to a user object or is ObjectId
        type: flag.type,
        reason: flag.reason,
        createdAt: flag.createdAt.toISOString(),
    };
}

// Helper function to transform a single Reaction from the Mongoose document to ReactionDTO
function transformToReactionDTO(reaction: any): ReactionDTO { // 'any' here assumes it's the raw Mongoose subdocument
    return {
        userId: reaction.userId ? reaction.userId.toString() : '', // Assuming 'userId' is populated to a user object or is ObjectId
        emoji: reaction.emoji,
        createdAt: reaction.createdAt.toISOString(),
    };
}

/**
 * Converts an IMessage from the database to a DTO format for the frontend
 * @param message of type IMessage
 * @returns MessageDTO type object ready for frontend consumption
 */
export const transformToMessageDTO = (message: IMessageDocument): MessageDTO => {
  // Handle the case where the message itself might be null or undefined,
  // though typically you'd expect a valid IMessageDocument here.
  // Returning null or throwing an error depends on your application's error handling.
  if (!message) {
    // Or throw new Error("Message document is null or undefined");
    return null as any; // Cast to any to satisfy MessageDTO return type, or adjust MessageDTO to allow null.
  }

  let flattened_replies: MessageDTO[] = [];
  // Only single depth recursive call as Message model is defined to populate only 1 depth of replies
  if (message.replies && Array.isArray(message.replies)) {
    flattened_replies = message.replies.map((reply) => transformToMessageDTO(reply as IMessageDocument));
  }

  // Transform metadata
  const metadataDTO: MessageMetadataDTO = {
    flags: message.metadata?.flags?.map(transformToFlagDTO) || [], // Map each flag using the new helper
    mentionedUsers: mapObjectIdsToStrings(message.metadata?.mentionedUsers), // Use the existing helper
    reactions: message.metadata?.reactions?.map(transformToReactionDTO) || [], // Map each reaction using the new helper
  };

  let flattened_msg: MessageDTO = {
    id: message.id.toString(), // _id is directly available on the document, no need for (_id as Types.ObjectId)._id
    metadata: metadataDTO, // Assign the transformed metadataDTO
    conversationId: message.conversationId
      ? message.conversationId.toString()
      : '', // Ensure string, not null if DTO expects string
    userId: message.userId ? message.userId.toString() : '', // Ensure string, not null if DTO expects string
    content: message.content || '', // Ensure string
    fileUrl: message.fileUrl || '', // Ensure string, not null, default to empty string
    fileName: message.fileName || '', // Ensure string, not null, default to empty string
    parentMessageId: message.parentMessageId
      ? message.parentMessageId.toString()
      : null, // Allow null if parentMessageId can be optional
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt ? message.updatedAt.toISOString() : message.createdAt.toISOString(), // Ensure updatedAt handles cases where it might not exist (e.g., new document before save)
    likedBy: mapObjectIdsToStrings(message.likedBy), // Use helper for likedBy
    replies: flattened_replies,
  };
  return flattened_msg;
};