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
  DirectMessageSchema: () => DirectMessage_default,
  MessageHistorySchema: () => MessageHistory_default,
  MessageMetadataSchema: () => MessageMetadataSchema,
  ROLES: () => ROLES,
  TYPE_OF_CHANNEL: () => TYPE_OF_CHANNEL,
  conversationSchema: () => Conversation_default,
  conversationTransformToDTO: () => conversationTransformToDTO,
  messageSchema: () => Message_default,
  organizationSchema: () => Organization_default,
  transformToMessageDTO: () => transformToMessageDTO,
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
    userFlaggedBy: [
      {
        type: import_mongoose2.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    adminFlaggedBy: [
      {
        type: import_mongoose2.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { _id: false }
  // Prevents nested _id creation inside metadata
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
    role: { type: String, enum: ROLES, default: ROLES.MEMBER },
    organizationAddress: { type: String }
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
var ConversationSchema = new import_mongoose4.default.Schema(
  {
    type: {
      type: String,
      enum: TYPE_OF_CHANNEL,
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
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    archived: {
      type: Boolean,
      default: false
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
    conversationId: message.conversationId ? message.conversationId.toString() : null,
    // channelId: message.channelId ? message.channelId.toString() : null, depricated
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
var conversationTransformToDTO = (conversation) => {
  const transformedConversation = {
    id: conversation._id.toString(),
    type: conversation.type,
    description: conversation?.description || null,
    name: conversation?.name || null,
    organizationId: conversation.organizationId.toString(),
    uniqueKey: conversation?.uniqueKey || null,
    archived: conversation.archived || false,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    participants: conversation?.participants ? conversation.participants.map((id) => id.toString()) : []
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
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
  return transformedUser;
};
var userTransformToPublicDTO = (user) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    // Included for general identification
    avatar: user.avatar || null,
    description: user.description || null,
    organizationId: user.organizationId.toString(),
    role: user.role
    // Optionally include createdAt and updatedAt if useful for display
    // createdAt: user.createdAt.toISOString(),
    // updatedAt: user.updatedAt.toISOString(),
  };
};

// src/types/DirectMessage.ts
var import_mongoose6 = __toESM(require("mongoose"));
var { Schema: Schema3 } = import_mongoose6.default;
var DirectMessageSchema = new Schema3(
  {
    conversationId: {
      type: Schema3.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    senderId: {
      type: Schema3.Types.ObjectId,
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
  DirectMessageSchema,
  MessageHistorySchema,
  MessageMetadataSchema,
  ROLES,
  TYPE_OF_CHANNEL,
  conversationSchema,
  conversationTransformToDTO,
  messageSchema,
  organizationSchema,
  transformToMessageDTO,
  transformToOrganizationDTO,
  userSchema,
  userTransformToDTO,
  userTransformToPublicDTO
});
