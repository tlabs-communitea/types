"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ConversationMetadataSchema: () => ConversationMetadataSchema,
  DirectMessageSchema: () => DirectMessage_default,
  MessageHistorySchema: () => MessageHistory_default,
  MessageMetadataSchema: () => MessageMetadataSchema,
  NOTIFICATION_STATUS: () => NOTIFICATION_STATUS,
  NOTIFICATION_TYPE: () => NOTIFICATION_TYPE,
  NotificationModel: () => NotificationModel,
  PushTokenModel: () => PushTokenModel,
  REASON_FOR_LOCK: () => REASON_FOR_LOCK,
  ROLES: () => ROLES,
  TYPE_OF_CHANNEL: () => TYPE_OF_CHANNEL,
  conversationSchema: () => Conversation_default,
  conversationTransformToDTO: () => conversationTransformToDTO,
  messageSchema: () => Message_default,
  notificationSchema: () => notificationSchema,
  organizationSchema: () => Organization_default,
  pushTokenSchema: () => pushTokenSchema,
  transformToMessageDTO: () => transformToMessageDTO,
  transformToNotificationDTO: () => transformToNotificationDTO,
  transformToOrganizationDTO: () => transformToOrganizationDTO,
  userSchema: () => User_default,
  userTransformToDTO: () => userTransformToDTO,
  userTransformToPublicDTO: () => userTransformToPublicDTO
});
module.exports = __toCommonJS(index_exports);

// src/types/MessageHistory.ts
var import_mongoose = __toESM(require("mongoose"));
var MessageHistorySchema = new import_mongoose.default.Schema(
  {
    messageId: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      ref: "Message",
      required: true
    },
    operation: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true
    },
    before: {
      type: import_mongoose.default.Schema.Types.Mixed
    },
    after: {
      type: import_mongoose.default.Schema.Types.Mixed
    },
    modifiedBy: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  }
  // { timestamps: true }
);
var MessageHistory_default = MessageHistorySchema;

// src/types/Message.ts
var import_mongoose2 = require("mongoose");
var MessageMetadataSchema = new import_mongoose2.Schema(
  {
    userFlaggedBy: {
      type: [import_mongoose2.Schema.Types.ObjectId],
      ref: "User",
      default: []
    },
    adminFlaggedBy: {
      type: [import_mongoose2.Schema.Types.ObjectId],
      ref: "User",
      default: []
    }
  },
  { _id: false }
);
var MessageSchema = new import_mongoose2.Schema(
  {
    userId: {
      type: import_mongoose2.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: false
    },
    fileUrl: {
      type: String,
      default: "",
      required: false
    },
    fileName: {
      type: String,
      default: "",
      required: false
    },
    conversationId: {
      type: import_mongoose2.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true
    },
    parentMessageId: {
      type: import_mongoose2.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
      index: true
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    likedBy: {
      type: [import_mongoose2.Schema.Types.ObjectId],
      ref: "User",
      default: []
    },
    metadata: {
      type: MessageMetadataSchema,
      default: {}
    }
  },
  { timestamps: true }
  //auto handle timestamps
);
MessageSchema.pre("validate", function(next) {
  if (!this.conversationId) {
    next(new Error("ConversationId must be provided."));
  } else {
    next();
  }
});
MessageSchema.virtual("replies", {
  ref: "Message",
  localField: "_id",
  foreignField: "parentMessageId"
});
MessageSchema.index({ content: "text" });
MessageSchema.pre(/^find/, function(next) {
  this.populate("replies");
  next();
});
var Message_default = MessageSchema;

// src/types/User.ts
var import_mongoose3 = __toESM(require("mongoose"));

// src/userDTO/types.ts
var ROLES = {
  ADMIN: "admin",
  MEMBER: "member"
};
var REASON_FOR_LOCK = {
  PENDING_APPROVAL: "pending approval",
  ADMIN_LOCK: "admin lock",
  UNLOCKED: "unlocked"
};

// src/types/User.ts
var userSchema = new import_mongoose3.default.Schema(
  {
    // Use IUserDocument here
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpires: { type: Date },
    avatar: { type: String },
    description: { type: String },
    organizationId: {
      type: import_mongoose3.default.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.MEMBER },
    organizationAddress: { type: String },
    isLocked: { type: Boolean, default: false },
    // indicates if the user account is locked by the admin
    reasonForLock: {
      type: String,
      enum: Object.values(REASON_FOR_LOCK),
      default: REASON_FOR_LOCK.UNLOCKED,
      validate: {
        validator: function(value) {
          if (this.isLocked) {
            return value !== REASON_FOR_LOCK.UNLOCKED;
          }
          return value === REASON_FOR_LOCK.UNLOCKED;
        },
        message: (props) => `${props.value} is not a valid reason for locking the user account.`
      }
    },
    metadata: {
      type: {
        interests: { type: [String], default: [] },
        prompts: {
          type: [
            {
              question: { type: String },
              answer: { type: String }
            }
          ],
          default: []
        },
        pronouns: { type: String, default: "" },
        lifeSituation: { type: String, default: "" },
        work: { type: String, default: "" },
        education: { type: String, default: "" },
        gender: { type: String, default: "" },
        lookingFor: { type: String, default: "" },
        sexuality: { type: String, default: "" },
        relationshipStatus: { type: String, default: "" },
        hasKids: { type: Boolean, default: null },
        religion: { type: String, default: "" },
        smoking: { type: Boolean, default: null },
        drinking: { type: Boolean, default: null },
        newToArea: { type: Boolean, default: null },
        starSign: { type: String, default: "" },
        pets: { type: Boolean, default: null }
      },
      required: false
    }
  },
  { timestamps: true }
);
var User_default = userSchema;

// src/types/Conversation.ts
var import_mongoose4 = __toESM(require("mongoose"));

// src/conversationDTO/types.ts
var TYPE_OF_CHANNEL = {
  channel: "channel",
  direct: "direct"
};

// src/types/Conversation.ts
var ConversationMetadataSchema = new import_mongoose4.default.Schema(
  {
    adminFlaggedBy: {
      type: [import_mongoose4.default.Schema.Types.ObjectId],
      ref: "User",
      default: []
    },
    adminHidden: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
  // prevents creation of a separate _id for metadata subdocument
);
var ConversationSchema = new import_mongoose4.default.Schema(
  {
    type: {
      type: String,
      enum: Object.values(TYPE_OF_CHANNEL),
      required: true
    },
    participants: {
      type: [
        {
          type: import_mongoose4.default.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      required: function() {
        return this.type === TYPE_OF_CHANNEL.direct;
      }
    },
    organizationId: {
      type: import_mongoose4.default.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    name: {
      type: String,
      // Only required for 'channel' type
      required: function() {
        return this.type === TYPE_OF_CHANNEL.channel;
      }
    },
    description: {
      type: String
    },
    uniqueKey: {
      type: String,
      unique: true,
      sparse: true
      // Only applicable for direct conversations
    },
    metadata: {
      type: ConversationMetadataSchema,
      default: {}
      // Ensure metadata always exists
    }
  },
  { timestamps: true }
);
ConversationSchema.pre("save", function(next) {
  if (this.type === TYPE_OF_CHANNEL.direct) {
    const sortedParticipants = this.participants.map((id) => id.toString()).sort();
    this.uniqueKey = sortedParticipants.join("_");
  }
  next();
});
ConversationSchema.index(
  { uniqueKey: 1, organizationId: 1 },
  { unique: true, sparse: true }
);
var Conversation_default = ConversationSchema;

// src/types/Organization.ts
var import_mongoose5 = __toESM(require("mongoose"));
var organizationSchema = new import_mongoose5.default.Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);
var Organization_default = organizationSchema;

// src/types/Notification.ts
var import_mongoose6 = __toESM(require("mongoose"));

// src/notificationsDTO/types.ts
var NOTIFICATION_TYPE = {
  MESSAGE: "message",
  MENTION: "mention",
  LIKE: "like",
  REPLY: "reply"
};
var NOTIFICATION_STATUS = {
  READ: "read",
  UNREAD: "unread"
};

// src/types/Notification.ts
var notificationSchema = new import_mongoose6.Schema(
  {
    sourceUserId: {
      type: import_mongoose6.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    targetUserId: {
      type: import_mongoose6.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(NOTIFICATION_STATUS),
      default: "unread"
    },
    link: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
    // Automatically handles createdAt and updatedAt
  }
);
var NotificationModel = import_mongoose6.default.model(
  "Notification",
  notificationSchema
);

// src/types/PushToken.ts
var import_mongoose7 = __toESM(require("mongoose"));
var pushTokenSchema = new import_mongoose7.default.Schema(
  {
    userId: {
      type: import_mongoose7.default.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
    // automatically handles createdAt and updatedAt
  }
);
var PushTokenModel = import_mongoose7.default.model(
  "PushToken",
  pushTokenSchema
);

// src/messagesDTO/MessageTransform.ts
function mapObjectIdsToStrings(ids) {
  return Array.isArray(ids) ? ids.map((id) => id.toString()) : [];
}
var transformToMessageDTO = (message) => {
  let flattened_replies = [];
  if (message.replies && Array.isArray(message.replies)) {
    flattened_replies = message.replies.map((reply) => transformToMessageDTO(reply));
  }
  let flattened_msg = {
    id: message._id._id.toString(),
    metadata: message?.metadata ? {
      userFlaggedBy: mapObjectIdsToStrings(message.metadata.userFlaggedBy),
      adminFlaggedBy: mapObjectIdsToStrings(
        message.metadata.adminFlaggedBy
      )
    } : null,
    // Use metadataDTO eventually
    conversationId: message.conversationId ? message.conversationId.toString() : null,
    userId: message.userId ? message.userId.toString() : null,
    content: message.content || "",
    fileUrl: message.fileUrl ? message.fileUrl.toString() : null,
    fileName: message.fileName ? message.fileName.toString() : null,
    parentMessageId: message.parentMessageId ? message.parentMessageId.toString() : null,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    likedBy: message.likedBy ? message.likedBy.map((id) => id.toString()) : [],
    replies: flattened_replies
  };
  return flattened_msg;
};

// src/conversationDTO/ConversationTransform.ts
function mapObjectIdsToStrings2(ids) {
  return Array.isArray(ids) ? ids.map((id) => id.toString()) : [];
}
var conversationTransformToDTO = (conversation) => {
  const transformedConversation = {
    id: conversation._id.toString(),
    type: conversation.type,
    description: conversation?.description || null,
    name: conversation?.name || null,
    organizationId: conversation.organizationId.toString(),
    uniqueKey: conversation?.uniqueKey || null,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    participants: conversation?.participants ? conversation.participants.map((id) => id.toString()) : [],
    metadata: {
      adminFlaggedBy: mapObjectIdsToStrings2(conversation.metadata?.adminFlaggedBy || null),
      adminHidden: conversation.metadata?.adminHidden || false
    }
  };
  return transformedConversation;
};

// src/organizationDTO/OrganizationTransform.ts
var transformToOrganizationDTO = (organization) => {
  return {
    id: organization.id,
    name: organization.name,
    createdAt: organization.createdAt.toISOString(),
    updatedAt: organization.updatedAt.toISOString()
  };
};

// src/userDTO/UserTransform.ts
var userTransformToDTO = (user) => {
  const transformedUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    password: user.password,
    resetPasswordToken: user.resetPasswordToken || null,
    resetPasswordTokenExpires: user.resetPasswordTokenExpires ? user.resetPasswordTokenExpires.toISOString() : null,
    avatar: user.avatar || null,
    description: user.description || null,
    organizationId: user.organizationId.toString(),
    role: user.role,
    organizationAddress: user.organizationAddress || null,
    isLocked: user.isLocked,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    reasonForLock: user.reasonForLock || REASON_FOR_LOCK.UNLOCKED
  };
  return transformedUser;
};
var defaultUserMetadata = () => ({
  interests: [],
  prompts: [],
  pronouns: "",
  lifeSituation: "",
  work: "",
  education: "",
  gender: "",
  lookingFor: "",
  sexuality: "",
  relationshipStatus: "",
  hasKids: null,
  religion: "",
  smoking: null,
  drinking: null,
  newToArea: null,
  starSign: "",
  pets: null
});
var userTransformToPublicDTO = (user) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    // Included for general identification
    avatar: user.avatar || null,
    description: user.description || null,
    organizationId: user.organizationId.toString(),
    role: user.role,
    // Optionally include createdAt and updatedAt if useful for display
    // createdAt: user.createdAt.toISOString(),
    // updatedAt: user.updatedAt.toISOString(),
    metadata: user.metadata || defaultUserMetadata()
  };
};

// src/notificationsDTO/NotificationTransform.ts
function transformToNotificationDTO(notification) {
  return {
    sourceUserId: notification.sourceUserId.toString(),
    type: notification.type,
    title: notification.title,
    content: notification.content,
    status: notification.status,
    link: notification.link,
    createdAt: notification.createdAt.toISOString()
  };
}

// src/types/DirectMessage.ts
var import_mongoose8 = __toESM(require("mongoose"));
var { Schema: Schema4 } = import_mongoose8.default;
var DirectMessageSchema = new Schema4(
  {
    conversationId: {
      type: Schema4.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    senderId: {
      type: Schema4.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);
DirectMessageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});
var DirectMessage_default = DirectMessageSchema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConversationMetadataSchema,
  DirectMessageSchema,
  MessageHistorySchema,
  MessageMetadataSchema,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE,
  NotificationModel,
  PushTokenModel,
  REASON_FOR_LOCK,
  ROLES,
  TYPE_OF_CHANNEL,
  conversationSchema,
  conversationTransformToDTO,
  messageSchema,
  notificationSchema,
  organizationSchema,
  pushTokenSchema,
  transformToMessageDTO,
  transformToNotificationDTO,
  transformToOrganizationDTO,
  userSchema,
  userTransformToDTO,
  userTransformToPublicDTO
});
