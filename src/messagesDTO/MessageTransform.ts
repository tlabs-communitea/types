import { Types } from 'mongoose';
import type { MessageDTO, IMessageDocument } from '../messagesDTO/types';

function mapObjectIdsToStrings(
  ids: Types.ObjectId[] | null | undefined
): string[] {
  return Array.isArray(ids) ? ids.map((id) => id.toString()) : [];
}

/**
 * Converts a IMessage from the database to a DTO format for the frontend
 * @param message of type IMessage
 * @returns MessageDTO type object ready for frontend consumption
 */
export const transformToMessageDTO = (message: IMessageDocument): MessageDTO => {

  let flattened_replies: MessageDTO[] = [];
  //only single depth recursive call as Message model is defined to populate onyl 1 depth of replies
  if (message.replies && Array.isArray(message.replies)) {
    flattened_replies = message.replies.map((reply) => transformToMessageDTO(reply as IMessageDocument));
  }

  let flattened_msg: MessageDTO = {
    id: (message._id as Types.ObjectId)._id.toString(),
    metadata: message?.metadata
      ? {
        userFlaggedBy: mapObjectIdsToStrings(message.metadata.userFlaggedBy),
        adminFlaggedBy: mapObjectIdsToStrings(
          message.metadata.adminFlaggedBy
        ),
        userFlags: message.metadata.userFlags
          ? message.metadata.userFlags.map((flag) => ({
            flaggedBy: flag.flaggedBy.toString(),
            reason: flag.reason,
            createdAt: flag.createdAt.toISOString(),
          }))
          : [],
        mentionedUsers: mapObjectIdsToStrings(
          message.metadata.mentionedUsers
        ),
      }
      : null, // Use metadataDTO eventually
    conversationId: message.conversationId
      ? message.conversationId.toString()
      : null,
    userId: message.userId ? message.userId.toString() : null,
    content: message.content || '',
    fileUrl: message.fileUrl ? message.fileUrl.toString() : null,
    fileName: message.fileName ? message.fileName.toString() : null,
    parentMessageId: message.parentMessageId
      ? message.parentMessageId.toString()
      : null,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    likedBy: message.likedBy
      ? message.likedBy.map((id: any) => id.toString())
      : [],
    replies: flattened_replies,
  };
  return flattened_msg;
};
