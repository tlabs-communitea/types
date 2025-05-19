import mongoose, { Document } from 'mongoose';
import { IUserDocument } from './User';
export interface IConversation extends Document {
    type: 'channel' | 'direct';
    name?: string;
    description?: string;
    participants?: IUserDocument[];
    organizationId: mongoose.Types.ObjectId;
    uniqueKey?: string;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
}
declare const _default: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}> & IConversation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Conversation.d.ts.map