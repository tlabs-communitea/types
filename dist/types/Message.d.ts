import mongoose, { Document, Types } from 'mongoose';
export interface IMessage extends Document {
    channelId?: Types.ObjectId;
    conversationId?: Types.ObjectId;
    userId: Types.ObjectId;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    createdAt: Date;
    updatedAt: Date;
    likedBy: Types.ObjectId[];
    parentMessageId?: Types.ObjectId;
    replies?: IMessage[];
}
declare const _default: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Message.d.ts.map