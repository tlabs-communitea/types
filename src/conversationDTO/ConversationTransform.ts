import mongoose, { Types } from 'mongoose';
import { ConversationDTO, IConversation } from './types';
import { userTransformToDTO } from '../userDTO/UserTransform';

function mapObjectIdsToStrings(
  ids: Types.ObjectId[] | null | undefined
): string[] {
  return Array.isArray(ids) ? ids.map((id) => id.toString()) : [];
}

export const conversationTransformToDTO = (
  conversation: IConversation
): ConversationDTO => {
  const transformedConversation: ConversationDTO = {
    id: (conversation._id as mongoose.Types.ObjectId).toString(),
    type: conversation.type,
    description: conversation.description || null,
    name: conversation.name || null,
    organizationId: conversation.organizationId.toString(),
    uniqueKey: conversation.uniqueKey || null,
    archived: conversation.archived || false,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    participants: conversation.participants ? conversation.participants.map(userTransformToDTO) : []

  };
  return transformedConversation;
};
