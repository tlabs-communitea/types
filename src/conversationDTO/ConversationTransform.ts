import mongoose, { Types } from 'mongoose';
import { ConversationDTO, IConversationDocument } from './types';

/**
 * Maps an array of ObjectIds to an array of strings.
 * If the input is null or undefined, it returns an empty array.
 * @param ids - Array of ObjectIds or null/undefined
 * @returns Array of strings representing the ObjectIds
 */
function mapObjectIdsToStrings(
  ids: Types.ObjectId[] | null | undefined
): string[] {
  return Array.isArray(ids) ? ids.map((id) => id.toString()) : [];
}

/**
 * Converts a conversation document from the database to a DTO format for the frontend.
 * @param conversation - The conversation document of type IConversationDocument
 * @returns ConversationDTO type object ready for frontend consumption
 */
export const conversationTransformToDTO = (
  conversation: IConversationDocument
): ConversationDTO => {
  const transformedConversation: ConversationDTO = {
    id: (conversation._id as mongoose.Types.ObjectId).toString(),
    type: conversation.type,
    description: conversation?.description || null,
    name: conversation?.name || null,
    organizationId: conversation.organizationId.toString(),
    uniqueKey: conversation?.uniqueKey || null,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    participants: conversation?.participants ? conversation.participants.map((id) => id.toString()) : [],
    metadata: {
      adminFlaggedBy: mapObjectIdsToStrings(conversation.metadata?.adminFlaggedBy || null),
      adminHidden: conversation.metadata?.adminHidden || false,
    },
  };
  return transformedConversation;
};
