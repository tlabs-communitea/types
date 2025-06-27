import mongoose, { Document, Types, Model } from 'mongoose';

declare const MessageHistorySchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}>, {}> & mongoose.FlatRecord<{
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

declare const REASON_FOR_FLAG: {
    readonly SPAM: "Spam or Unsolicited";
    readonly INAPPROPRIATE: "Inappropriate Content";
    readonly HARASSMENT: "Harassment or Bullying";
    readonly MISINFORMATION: "Misinformation or False Information";
    readonly OTHER: "Other";
};
type ReasonForFlag = typeof REASON_FOR_FLAG[keyof typeof REASON_FOR_FLAG];
interface Flag {
    flaggedBy: Types.ObjectId;
    reason: ReasonForFlag;
    createdAt: Date;
}
interface FlagDTO {
    flaggedBy: string;
    reason: ReasonForFlag;
    createdAt: string;
}
interface IMessage {
    conversationId?: Types.ObjectId;
    userId: Types.ObjectId;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    createdAt: Date;
    updatedAt: Date;
    likedBy: Types.ObjectId[];
    parentMessageId?: Types.ObjectId;
    replies?: IMessageDocument[];
    metadata: MessageMetadata;
}
interface IMessageDocument extends Document, IMessage {
}
type MongooseSpecificTypes$3 = keyof Document;
type CreateMessage = Omit<IMessageDocument, MongooseSpecificTypes$3>;
interface MessageMetadata {
    userFlaggedBy?: Types.ObjectId[];
    adminFlaggedBy?: Types.ObjectId[];
    userFlags?: Flag[];
    mentionedUsers?: Types.ObjectId[];
}
interface MessageMetadataDTO {
    userFlags: FlagDTO[];
    userFlaggedBy: string[];
    adminFlaggedBy: string[];
    mentionedUsers: string[];
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

declare const FlagSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: NativeDate;
    flaggedBy: any;
    reason: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    flaggedBy: any;
    reason: string;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    flaggedBy: any;
    reason: string;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const MessageMetadataSchema: mongoose.Schema<MessageMetadata, mongoose.Model<MessageMetadata, any, any, any, mongoose.Document<unknown, any, MessageMetadata, any> & MessageMetadata & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, MessageMetadata, mongoose.Document<unknown, {}, mongoose.FlatRecord<MessageMetadata>, {}> & mongoose.FlatRecord<MessageMetadata> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const MessageSchema: mongoose.Schema<IMessageDocument, mongoose.Model<IMessageDocument, any, any, any, mongoose.Document<unknown, any, IMessageDocument, any> & IMessageDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IMessageDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<IMessageDocument>, {}> & mongoose.FlatRecord<IMessageDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

declare const ROLES: {
    readonly ADMIN: "admin";
    readonly MEMBER: "member";
};
declare const REASON_FOR_LOCK: {
    readonly PENDING_APPROVAL: "pending approval";
    readonly ADMIN_LOCK: "admin lock";
    readonly UNLOCKED: "unlocked";
};
declare const GENDER: {
    readonly MALE: "male";
    readonly FEMALE: "female";
    readonly NON_BINARY: "non-binary";
    readonly OTHER: "other";
    readonly PREFER_NOT_TO_SAY: "prefer not to say";
};
declare const SEXUALITY: {
    readonly STRAIGHT: "straight";
    readonly GAY: "gay";
    readonly LESBIAN: "lesbian";
    readonly BISEXUAL: "bisexual";
    readonly PANSEXUAL: "pansexual";
    readonly ASEXUAL: "asexual";
    readonly QUEER: "queer";
    readonly OTHER: "other";
    readonly PREFER_NOT_TO_SAY: "prefer not to say";
};
declare const RELATIONSHIP_STATUS: {
    readonly SINGLE: "single";
    readonly IN_A_RELATIONSHIP: "in a relationship";
    readonly MARRIED: "married";
    readonly DIVORCED: "divorced";
    readonly WIDOWED: "widowed";
    readonly COMPLICATED: "it's complicated";
    readonly PREFER_NOT_TO_SAY: "prefer not to say";
};
declare const defaultUserMetadata: () => UserMetadata;
type ReasonForLock = typeof REASON_FOR_LOCK[keyof typeof REASON_FOR_LOCK];
type Role = typeof ROLES[keyof typeof ROLES];
type Gender = typeof GENDER[keyof typeof GENDER];
type Sexuality = typeof SEXUALITY[keyof typeof SEXUALITY];
type RelationshipStatus = typeof RELATIONSHIP_STATUS[keyof typeof RELATIONSHIP_STATUS];
interface PromptAnswer {
    question: string;
    answer: string;
}
type Nullable<T> = T | null;
interface UserMetadata {
    interests: string[];
    prompts: PromptAnswer[];
    pronouns: string;
    lifeSituation: string;
    work: string;
    education: string;
    gender: Nullable<Sexuality>;
    lookingFor: string;
    sexuality: Nullable<Sexuality>;
    relationshipStatus: Nullable<RelationshipStatus>;
    hasKids: Nullable<boolean>;
    religion: string;
    smoking: Nullable<boolean>;
    drinking: Nullable<boolean>;
    newToArea: Nullable<boolean>;
    starSign: string;
    pets: Nullable<boolean>;
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
    role: Role;
    organizationAddress?: string;
    isLocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    reasonForLock: ReasonForLock;
    metadata?: UserMetadata;
}
interface IUserDocument extends IUser, Document {
}
type MongooseSpecificTypes$2 = keyof Document;
type CreateUser = Omit<IUserDocument, MongooseSpecificTypes$2>;
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
    isLocked: boolean;
    createdAt: string;
    updatedAt: string;
    reasonForLock: ReasonForLock;
    metadata: UserMetadata;
}
interface PublicUserDTO {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    description: string | null;
    organizationId: string;
    role: Role;
    metadata: UserMetadata;
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

declare const TYPE_OF_CHANNEL: {
    readonly channel: "channel";
    readonly direct: "direct";
};
type TYPE_OF_CHANNEL = (typeof TYPE_OF_CHANNEL)[keyof typeof TYPE_OF_CHANNEL];
interface IConversation {
    type: TYPE_OF_CHANNEL;
    name?: string;
    description?: string;
    participants?: mongoose.Types.ObjectId[];
    organizationId: mongoose.Types.ObjectId;
    uniqueKey?: string;
    createdAt: Date;
    updatedAt: Date;
    metadata: {
        adminFlaggedBy?: mongoose.Types.ObjectId[];
        adminHidden?: boolean;
    };
}
interface ConversationMetadata {
    adminFlaggedBy: mongoose.Types.ObjectId[];
    adminHidden: boolean;
}
interface ConversationMetadataDTO {
    adminFlaggedBy: string[];
    adminHidden: boolean;
}
interface IConversationDocument extends Document, IConversation {
}
type MongooseSpecificTypes$1 = keyof Document;
type CreateConversation = Omit<IConversationDocument, MongooseSpecificTypes$1>;
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
    metadata: {
        adminFlaggedBy: string[];
        adminHidden: boolean;
    };
}
interface ConversationDetailsDTO {
    id: string;
    name: string | null;
    description: string | null;
    members: PublicUserDTO[];
    admin: PublicUserDTO;
}

declare const ConversationMetadataSchema: mongoose.Schema<ConversationMetadata, mongoose.Model<ConversationMetadata, any, any, any, mongoose.Document<unknown, any, ConversationMetadata, any> & ConversationMetadata & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ConversationMetadata, mongoose.Document<unknown, {}, mongoose.FlatRecord<ConversationMetadata>, {}> & mongoose.FlatRecord<ConversationMetadata> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
declare const ConversationSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: "channel" | "direct";
    metadata: ConversationMetadata;
    organizationId: any;
    participants: any[];
    name?: string | null | undefined;
    description?: string | null | undefined;
    uniqueKey?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: "channel" | "direct";
    metadata: ConversationMetadata;
    organizationId: any;
    participants: any[];
    name?: string | null | undefined;
    description?: string | null | undefined;
    uniqueKey?: string | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: "channel" | "direct";
    metadata: ConversationMetadata;
    organizationId: any;
    participants: any[];
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
type MongooseSpecificTypes = keyof Document;
type CreateOrganization = Omit<IOrganizationDocument, MongooseSpecificTypes>;
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

declare const NOTIFICATION_TYPE: {
    readonly MESSAGE: "message";
    readonly MENTION: "mention";
    readonly LIKE: "like";
    readonly REPLY: "reply";
};
type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
declare const NOTIFICATION_STATUS: {
    readonly READ: "read";
    readonly UNREAD: "unread";
};
type NotificationStatus = typeof NOTIFICATION_STATUS[keyof typeof NOTIFICATION_STATUS];
interface INotification {
    sourceUserId: Types.ObjectId;
    targetUserId: Types.ObjectId;
    type: NotificationType;
    title: string;
    content: string;
    status: NotificationStatus;
    createdAt: Date;
    updatedAt: Date;
    link: string | null;
}
interface INotificationDocument extends INotification, mongoose.Document {
}
type NotificationDTO = Omit<INotification, 'targetUserId' | 'updatedAt' | 'createdAt' | 'sourceUserId'> & {
    sourceUserId: string;
    createdAt: string;
};

declare const notificationSchema: mongoose.Schema<INotificationDocument, mongoose.Model<INotificationDocument, any, any, any, mongoose.Document<unknown, any, INotificationDocument, any> & INotificationDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, INotificationDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<INotificationDocument>, {}> & mongoose.FlatRecord<INotificationDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const NotificationModel: Model<INotificationDocument>;

interface IPushToken {
    userId: Types.ObjectId;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}
interface IPushTokenDocument extends IPushToken, Document {
}
declare const pushTokenSchema: mongoose.Schema<IPushTokenDocument, mongoose.Model<IPushTokenDocument, any, any, any, mongoose.Document<unknown, any, IPushTokenDocument, any> & IPushTokenDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IPushTokenDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<IPushTokenDocument>, {}> & mongoose.FlatRecord<IPushTokenDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const PushTokenModel: Model<IPushTokenDocument>;

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

/**
 * Converts a IMessage from the database to a DTO format for the frontend
 * @param message of type IMessage
 * @returns MessageDTO type object ready for frontend consumption
 */
declare const transformToMessageDTO: (message: IMessageDocument) => MessageDTO;

/**
 * Converts a conversation document from the database to a DTO format for the frontend.
 * @param conversation - The conversation document of type IConversationDocument
 * @returns ConversationDTO type object ready for frontend consumption
 */
declare const conversationTransformToDTO: (conversation: IConversationDocument) => ConversationDTO;

/**
 * Transforms an organization document into a DTO format.
 * @param organization - The organization document to transform.
 * @returns The transformed organization DTO.
 */
declare const transformToOrganizationDTO: (organization: IOrganizationDocument) => OrganizationDTO;

/**
 * Transforms a user document into a DTO format.
 * @param user - The user document to transform.
 * @returns The transformed user DTO.
 */
declare const userTransformToDTO: (user: IUserDocument) => UserDTO;
/**
 * Transforms a user document into a public DTO format, exposing only necessary fields.
 * @param user - The user document to transform.
 * @returns The transformed public user DTO.
 */
declare const userTransformToPublicDTO: (user: IUserDocument) => PublicUserDTO;

declare function transformToNotificationDTO(notification: INotificationDocument): NotificationDTO;

interface UserWithoutSensitiveInfo {
    id: string;
    name: string;
    email: string;
    role: Role;
    isLocked: boolean;
    avatar: string | null;
    organizationId: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    reasonForLock: ReasonForLock;
}
type CountPerDate = Record<string, number>;
interface MostActiveConversation {
    id?: string;
    name: string;
    messageCount: number;
}
interface UserAndMessageCount {
    userCount: number;
    messageCount: number;
}

interface SuccessResponse {
    message: string;
}
interface FailureResponse {
    error: string;
}

export { type ConversationDTO, type ConversationDetailsDTO, type ConversationMetadata, type ConversationMetadataDTO, ConversationMetadataSchema, type CountPerDate, type CreateConversation, type CreateMessage, type CreateOrganization, type CreateUser, DirectMessageSchema, type FailureResponse, type Flag, type FlagDTO, FlagSchema, GENDER, type Gender, type IConversation, type IConversationDocument, type IMessage, type IMessageDocument, type INotification, type INotificationDocument, type IOrganization, type IOrganizationDocument, type IPushToken, type IPushTokenDocument, type IUser, type IUserDocument, type MessageDTO, MessageHistorySchema, type MessageMetadata, type MessageMetadataDTO, MessageMetadataSchema, type MostActiveConversation, NOTIFICATION_STATUS, NOTIFICATION_TYPE, type NotificationDTO, NotificationModel, type NotificationStatus, type NotificationType, type Nullable, type OrganizationDTO, type PromptAnswer, type PublicUserDTO, PushTokenModel, REASON_FOR_FLAG, REASON_FOR_LOCK, RELATIONSHIP_STATUS, ROLES, type ReasonForFlag, type ReasonForLock, type RelationshipStatus, type Role, SEXUALITY, type Sexuality, type SuccessResponse, TYPE_OF_CHANNEL, type UserAndMessageCount, type UserDTO, type UserMetadata, type UserWithoutSensitiveInfo, ConversationSchema as conversationSchema, conversationTransformToDTO, defaultUserMetadata, MessageSchema as messageSchema, notificationSchema, organizationSchema, pushTokenSchema, transformToMessageDTO, transformToNotificationDTO, transformToOrganizationDTO, userSchema, userTransformToDTO, userTransformToPublicDTO };
