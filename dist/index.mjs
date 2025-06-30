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
  type: {
    type: String,
    enum: ["user", "admin"],
    required: true
  },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });
var MessageMetadataSchema = new Schema2(
  {
    flags: {
      type: [FlagSchema],
      default: []
    },
    mentionedUsers: {
      type: [Schema2.Types.ObjectId],
      ref: "User",
      default: []
    },
    reactions: {
      type: [new Schema2({
        userId: { type: Schema2.Types.ObjectId, ref: "User", required: true },
        emoji: { type: String, required: true },
        // e.g., '👍', '❤️', '😂'
        createdAt: { type: Date, default: Date.now }
      }, { _id: false })],
      default: []
    }
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
      required: false,
      default: ""
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
    likedBy: {
      type: [Schema2.Types.ObjectId],
      ref: "User",
      default: []
    },
    // Use the redesigned metadata schema
    metadata: {
      type: MessageMetadataSchema,
      default: () => ({ flags: [], mentionedUsers: [], reactions: [] })
      // Ensure default initializes new fields
    }
  },
  { timestamps: true }
  // Mongoose handles createdAt and updatedAt automatically
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
  this.populate("replies").populate("metadata.mentionedUsers").populate("metadata.flags.flaggedBy").populate("metadata.reactions.userId");
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
var GENDER = {
  MALE: "male",
  FEMALE: "female",
  NON_BINARY: "non-binary",
  OTHER: "other",
  PREFER_NOT_TO_SAY: "prefer not to say"
};
var SEXUALITY = {
  STRAIGHT: "straight",
  GAY: "gay",
  LESBIAN: "lesbian",
  BISEXUAL: "bisexual",
  PANSEXUAL: "pansexual",
  ASEXUAL: "asexual",
  QUEER: "queer",
  OTHER: "other",
  PREFER_NOT_TO_SAY: "prefer not to say"
};
var RELATIONSHIP_STATUS = {
  SINGLE: "single",
  IN_A_RELATIONSHIP: "in a relationship",
  MARRIED: "married",
  DIVORCED: "divorced",
  WIDOWED: "widowed",
  COMPLICATED: "it's complicated",
  PREFER_NOT_TO_SAY: "prefer not to say"
};
var defaultUserMetadata = () => ({
  interests: [],
  prompts: [],
  pronouns: "",
  lifeSituation: "",
  work: "",
  education: "",
  gender: null,
  lookingFor: "",
  sexuality: null,
  relationshipStatus: null,
  hasKids: null,
  religion: "",
  smoking: null,
  drinking: null,
  newToArea: null,
  starSign: "",
  pets: null
});

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
        gender: { type: String, enum: Object.values(GENDER), default: "" },
        lookingFor: { type: String, default: "" },
        sexuality: { type: String, enum: Object.values(SEXUALITY), default: "" },
        relationshipStatus: { type: String, enum: Object.values(RELATIONSHIP_STATUS), default: "" },
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

// src/messagesDTO/MessageTransform.ts
function mapObjectIdsToStrings(ids) {
  return Array.isArray(ids) ? ids.map((id) => id.toString()) : [];
}
function transformToFlagDTO(flag) {
  return {
    flaggedBy: flag.flaggedBy ? flag.flaggedBy.toString() : "",
    // Assuming 'flaggedBy' is populated to a user object or is ObjectId
    type: flag.type,
    reason: flag.reason,
    createdAt: flag.createdAt.toISOString()
  };
}
function transformToReactionDTO(reaction) {
  return {
    userId: reaction.userId ? reaction.userId.toString() : "",
    // Assuming 'userId' is populated to a user object or is ObjectId
    emoji: reaction.emoji,
    createdAt: reaction.createdAt.toISOString()
  };
}
var transformToMessageDTO = (message) => {
  if (!message) {
    return null;
  }
  let flattened_replies = [];
  if (message.replies && Array.isArray(message.replies)) {
    flattened_replies = message.replies.map((reply) => transformToMessageDTO(reply));
  }
  const metadataDTO = {
    flags: message.metadata?.flags?.map(transformToFlagDTO) || [],
    // Map each flag using the new helper
    mentionedUsers: mapObjectIdsToStrings(message.metadata?.mentionedUsers),
    // Use the existing helper
    reactions: message.metadata?.reactions?.map(transformToReactionDTO) || []
    // Map each reaction using the new helper
  };
  let flattened_msg = {
    id: message.id.toString(),
    // _id is directly available on the document, no need for (_id as Types.ObjectId)._id
    metadata: metadataDTO,
    // Assign the transformed metadataDTO
    conversationId: message.conversationId ? message.conversationId.toString() : "",
    // Ensure string, not null if DTO expects string
    userId: message.userId ? message.userId.toString() : "",
    // Ensure string, not null if DTO expects string
    content: message.content || "",
    // Ensure string
    fileUrl: message.fileUrl || "",
    // Ensure string, not null, default to empty string
    fileName: message.fileName || "",
    // Ensure string, not null, default to empty string
    parentMessageId: message.parentMessageId ? message.parentMessageId.toString() : null,
    // Allow null if parentMessageId can be optional
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt ? message.updatedAt.toISOString() : message.createdAt.toISOString(),
    // Ensure updatedAt handles cases where it might not exist (e.g., new document before save)
    likedBy: mapObjectIdsToStrings(message.likedBy),
    // Use helper for likedBy
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
    reasonForLock: user.reasonForLock || REASON_FOR_LOCK.UNLOCKED,
    metadata: user.metadata || defaultUserMetadata()
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
export {
  ConversationMetadataSchema,
  DirectMessage_default as DirectMessageSchema,
  FlagSchema,
  GENDER,
  MessageHistory_default as MessageHistorySchema,
  MessageMetadataSchema,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE,
  NotificationModel,
  PushTokenModel,
  REASON_FOR_FLAG,
  REASON_FOR_LOCK,
  RELATIONSHIP_STATUS,
  ROLES,
  SEXUALITY,
  TYPE_OF_CHANNEL,
  Conversation_default as conversationSchema,
  conversationTransformToDTO,
  defaultUserMetadata,
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
