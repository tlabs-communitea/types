import mongoose, { Types, Document } from 'mongoose';

declare const MessageHistorySchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;

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
declare const MessageSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: any;
    conversationId: any;
    channelId: any;
    parentMessageId: any;
    likedBy: any;
    content?: string | null | undefined;
    fileUrl?: string | null | undefined;
    fileName?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: any;
    conversationId: any;
    channelId: any;
    parentMessageId: any;
    likedBy: any;
    content?: string | null | undefined;
    fileUrl?: string | null | undefined;
    fileName?: string | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    userId: any;
    conversationId: any;
    channelId: any;
    parentMessageId: any;
    likedBy: any;
    content?: string | null | undefined;
    fileUrl?: string | null | undefined;
    fileName?: string | null | undefined;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

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
declare const userSchema: mongoose.Schema<IUserDocument, mongoose.Model<IUserDocument, any, any, any, mongoose.Document<unknown, any, IUserDocument, any> & IUserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUserDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUserDocument>, {}> & mongoose.FlatRecord<IUserDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

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
declare const ConversationSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: "channel" | "direct";
    createdAt: NativeDate;
    updatedAt: NativeDate;
    organizationId: any;
    participants: any[];
    archived: any;
    name?: string | null | undefined;
    description?: string | null | undefined;
    uniqueKey?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: "channel" | "direct";
    createdAt: NativeDate;
    updatedAt: NativeDate;
    organizationId: any;
    participants: any[];
    archived: any;
    name?: string | null | undefined;
    description?: string | null | undefined;
    uniqueKey?: string | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: "channel" | "direct";
    createdAt: NativeDate;
    updatedAt: NativeDate;
    organizationId: any;
    participants: any[];
    archived: any;
    name?: string | null | undefined;
    description?: string | null | undefined;
    uniqueKey?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;

interface IOrganization {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
interface IOrganizationDocument extends IOrganization, Document {
}
declare const organizationSchema: mongoose.Schema<IOrganizationDocument, mongoose.Model<IOrganizationDocument, any, any, any, mongoose.Document<unknown, any, IOrganizationDocument, any> & IOrganizationDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IOrganizationDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<IOrganizationDocument>, {}> & mongoose.FlatRecord<IOrganizationDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

declare const DirectMessageSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    content: string;
    conversationId: any;
    senderId: any;
    likes: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    content: string;
    conversationId: any;
    senderId: any;
    likes: number;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    content: string;
    conversationId: any;
    senderId: any;
    likes: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;

export { DirectMessageSchema, type IConversation, type IMessage, type IOrganization, type IOrganizationDocument, type IUser, type IUserDocument, MessageHistorySchema, ConversationSchema as conversationSchema, MessageSchema as messageSchema, organizationSchema, userSchema };
