// src/types/MessageHistory.ts
import mongoose from "mongoose";
var MessageHistorySchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true
    },
    operation: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true
    },
    before: {
      type: mongoose.Schema.Types.Mixed
    },
    after: {
      type: mongoose.Schema.Types.Mixed
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  }
  // { timestamps: true }
);
var MessageHistory_default = MessageHistorySchema;

// src/types/Message.ts
import mongoose2, { Schema as Schema2 } from "mongoose";
var FlagSchema = new mongoose2.Schema({
  flaggedBy: { type: mongoose2.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
var MessageMetadataSchema = new Schema2(
  {
    userFlaggedBy: {
      type: [Schema2.Types.ObjectId],
      ref: "User",
      default: []
    },
    adminFlaggedBy: {
      type: [Schema2.Types.ObjectId],
      ref: "User",
      default: []
    },
    userFlags: [FlagSchema]
  },
  { _id: false }
);
var MessageSchema = new Schema2(
  {
    userId: {
      type: Schema2.Types.ObjectId,
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
      type: Schema2.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true
    },
    parentMessageId: {
      type: Schema2.Types.ObjectId,
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
      type: [Schema2.Types.ObjectId],
      ref: "User",
      default: []
    },
    metadata: {
      type: MessageMetadataSchema,
      default: () => ({ userFlaggedBy: [], adminFlaggedBy: [] })
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
import mongoose3 from "mongoose";

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
var userSchema = new mongoose3.Schema(
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
      type: mongoose3.Schema.Types.ObjectId,
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
    }
  },
  { timestamps: true }
);
var User_default = userSchema;

// src/types/Conversation.ts
import mongoose4 from "mongoose";

// src/conversationDTO/types.ts
var TYPE_OF_CHANNEL = {
  channel: "channel",
  direct: "direct"
};

// src/types/Conversation.ts
var ConversationMetadataSchema = new mongoose4.Schema(
  {
    adminFlaggedBy: {
      type: [mongoose4.Schema.Types.ObjectId],
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
var ConversationSchema = new mongoose4.Schema(
  {
    type: {
      type: String,
      enum: Object.values(TYPE_OF_CHANNEL),
      required: true
    },
    participants: {
      type: [
        {
          type: mongoose4.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      required: function() {
        return this.type === TYPE_OF_CHANNEL.direct;
      }
    },
    organizationId: {
      type: mongoose4.Schema.Types.ObjectId,
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
import mongoose5 from "mongoose";
var organizationSchema = new mongoose5.Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);
var Organization_default = organizationSchema;

// src/types/Notification.ts
import mongoose6, { Schema as Schema3 } from "mongoose";

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
var notificationSchema = new Schema3(
  {
    sourceUserId: {
      type: Schema3.Types.ObjectId,
      ref: "User",
      required: true
    },
    targetUserId: {
      type: Schema3.Types.ObjectId,
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
var NotificationModel = mongoose6.model(
  "Notification",
  notificationSchema
);

// src/types/PushToken.ts
import mongoose7 from "mongoose";
var pushTokenSchema = new mongoose7.Schema(
  {
    userId: {
      type: mongoose7.Schema.Types.ObjectId,
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
var PushTokenModel = mongoose7.model(
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
      ),
      userFlags: message.metadata.userFlags ? message.metadata.userFlags.map((flag) => ({
        flaggedBy: flag.flaggedBy.toString(),
        reason: flag.reason,
        createdAt: flag.createdAt.toISOString()
      })) : []
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

// src/messagesDTO/types.ts
var REASON_FOR_FLAG = {
  SPAM: "Spam or Unsolicited",
  INAPPROPRIATE: "Inappropriate Content",
  HARASSMENT: "Harassment or Bullying",
  MISINFORMATION: "Misinformation or False Information",
  OTHER: "Other"
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
import mongoose8 from "mongoose";
var { Schema: Schema4 } = mongoose8;
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
export {
  ConversationMetadataSchema,
  DirectMessage_default as DirectMessageSchema,
  FlagSchema,
  MessageHistory_default as MessageHistorySchema,
  MessageMetadataSchema,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE,
  NotificationModel,
  PushTokenModel,
  REASON_FOR_FLAG,
  REASON_FOR_LOCK,
  ROLES,
  TYPE_OF_CHANNEL,
  Conversation_default as conversationSchema,
  conversationTransformToDTO,
  Message_default as messageSchema,
  notificationSchema,
  Organization_default as organizationSchema,
  pushTokenSchema,
  transformToMessageDTO,
  transformToNotificationDTO,
  transformToOrganizationDTO,
  User_default as userSchema,
  userTransformToDTO,
  userTransformToPublicDTO
};
