import mongoose, { Document, Types } from 'mongoose';

interface IMessage extends Document {
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

interface IUser {
    name: string;
    email: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordTokenExpires?: Date;
    avatar?: string;
    description?: string;
    organizationId: Types.ObjectId;
    role: 'admin' | 'member';
    organizationAddress?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface IUserDocument extends IUser, Document {
}

interface IConversation extends Document {
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

interface IOrganization {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
interface IOrganizationDocument extends IOrganization, Document {
}

export type { IConversation, IMessage, IOrganization, IOrganizationDocument, IUser, IUserDocument };
