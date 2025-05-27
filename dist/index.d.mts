import mongoose, { Document, Types } from 'mongoose';

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
    metadata?: MessageMetadata;
}
interface MessageMetadata {
    userFlaggedBy: Types.ObjectId[];
    adminFlaggedBy: Types.ObjectId[];
}
interface MessageMetadataDTO {
    userFlaggedBy: string[];
    adminFlaggedBy: string[];
}
interface MessageDTO {
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

declare const MessageMetadataSchema: mongoose.Schema<MessageMetadata, mongoose.Model<MessageMetadata, any, any, any, mongoose.Document<unknown, any, MessageMetadata, any> & MessageMetadata & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, MessageMetadata, mongoose.Document<unknown, {}, mongoose.FlatRecord<MessageMetadata>, {}> & mongoose.FlatRecord<MessageMetadata> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const MessageSchema: mongoose.Schema<IMessage, mongoose.Model<IMessage, any, any, any, mongoose.Document<unknown, any, IMessage, any> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IMessage, mongoose.Document<unknown, {}, mongoose.FlatRecord<IMessage>, {}> & mongoose.FlatRecord<IMessage> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

declare const ROLES: {
    readonly ADMIN: "admin";
    readonly MEMBER: "member";
};
type Role = typeof ROLES[keyof typeof ROLES];
interface IUser {
    name: string;
    email: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordTokenExpires?: Date;
    avatar?: string;
    description?: string;
    organizationId: Types.ObjectId;
    role: Role;
    organizationAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}
interface IUserDocument extends IUser, Document {
}
interface UserDTO {
    id: string;
    name: string;
    email: string;
    password: string;
    resetPasswordToken: string | null;
    resetPasswordTokenExpires: string | null;
    avatar: string | null;
    description: string | null;
    organizationId: string;
    role: Role;
    organizationAddress: string | null;
    createdAt: string;
    updatedAt: string;
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
interface OrganizationDTO {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
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

/**
 * Converts a IMessage from the database to a DTO format for the frontend
 * @param message of type IMessage
 * @returns MessageDTO type object ready for frontend consumption
 */
declare const transformToMessageDTO: (message: IMessage) => MessageDTO;

declare const TYPE_OF_CHANNEL: {
    readonly channel: "channel";
    readonly direct: "direct";
};
type TYPE_OF_CHANNEL = typeof TYPE_OF_CHANNEL[keyof typeof TYPE_OF_CHANNEL];
interface IConversation extends Document {
    type: TYPE_OF_CHANNEL;
    name?: string;
    description?: string;
    participants?: mongoose.Types.ObjectId[];
    organizationId: mongoose.Types.ObjectId;
    uniqueKey?: string;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
}
interface ConversationDTO {
    id: string;
    type: TYPE_OF_CHANNEL;
    name: string | null;
    description: string | null;
    participants: string[];
    organizationId: string;
    uniqueKey: string | null;
    createdAt: string;
    updatedAt: string;
    archived: boolean;
}

declare const conversationTransformToDTO: (conversation: IConversation) => ConversationDTO;

declare const transformToOrganizationDTO: (organization: IOrganizationDocument) => OrganizationDTO;

declare const userTransformToDTO: (user: IUserDocument) => UserDTO;

declare const DirectMessageSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    conversationId: any;
    content: string;
    senderId: any;
    likes: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    conversationId: any;
    content: string;
    senderId: any;
    likes: number;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    conversationId: any;
    content: string;
    senderId: any;
    likes: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;

export { type ConversationDTO, DirectMessageSchema, type IConversation, type IMessage, type IOrganization, type IOrganizationDocument, type IUser, type IUserDocument, type MessageDTO, MessageHistorySchema, type MessageMetadata, type MessageMetadataDTO, MessageMetadataSchema, type OrganizationDTO, ROLES, type Role, TYPE_OF_CHANNEL, type UserDTO, ConversationSchema as conversationSchema, conversationTransformToDTO, MessageSchema as messageSchema, organizationSchema, transformToMessageDTO, transformToOrganizationDTO, userSchema, userTransformToDTO };
