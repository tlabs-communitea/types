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
  },
  { timestamps: true }
);
var MessageHistory_default = MessageHistorySchema;

// src/types/Message.ts
import mongoose2, { Schema as Schema2 } from "mongoose";
var MessageMetadataSchema = new Schema2(
  {
    userFlaggedBy: [
      {
        type: Schema2.Types.ObjectId,
        ref: "User"
      }
    ],
    adminFlaggedBy: [
      {
        type: Schema2.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { _id: false }
  // Prevents nested _id creation inside metadata
);
var MessageSchema = new mongoose2.Schema(
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
    channelId: {
      type: Schema2.Types.ObjectId,
      ref: "Channel",
      default: null,
      index: true
    },
    parentMessageId: {
      type: Schema2.Types.ObjectId,
      ref: "Message",
      default: null,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    likedBy: {
      type: [Schema2.Types.ObjectId],
      ref: "User",
      default: []
    },
    metadata: {
      type: MessageMetadataSchema,
      default: {}
    }
  },
  { timestamps: true }
);
MessageSchema.pre("validate", function(next) {
  if (!this.conversationId && !this.channelId) {
    next(new Error("Either conversationId or channelId must be provided."));
  } else {
    next();
  }
});
MessageSchema.virtual("replies", {
  ref: "Message",
  localField: "_id",
  foreignField: "parentMessageId"
});
MessageSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.channelId = ret.channelId ? ret.channelId.toString() : null;
    ret.conversationId = ret.conversationId ? ret.conversationId.toString() : null;
    ret.userId = ret.userId ? ret.userId.toString() : null;
    ret.parentMessageId = ret.parentMessageId ? ret.parentMessageId.toString() : null;
    ret.likedBy = ret.likedBy.map((id) => id.toString());
    ret.content = ret.content.toString() || "";
    ret.fileUrl = ret.fileUrl.toString();
    ret.fileName = ret.fileName.toString();
    ret.createdAt = ret.createdAt instanceof Date ? ret.createdAt.toISOString() : ret.createdAt;
    ret.updatedAt = ret.updatedAt instanceof Date ? ret.updatedAt.toISOString() : ret.updatedAt;
    if (ret.replies && Array.isArray(ret.replies)) {
      ret.replies = ret.replies.map((reply) => ({
        id: reply._id ? reply._id.toString() : void 0,
        userId: reply.userId ? reply.userId.toString() : null,
        content: reply.content,
        fileUrl: reply.fileUrl,
        fileName: reply.fileName,
        conversationId: reply.conversationId ? reply.conversationId.toString() : null,
        channelId: reply.channelId ? reply.channelId.toString() : null,
        parentMessageId: reply.parentMessageId ? reply.parentMessageId.toString() : null,
        createdAt: reply.createdAt instanceof Date ? reply.createdAt.toISOString() : reply.createdAt,
        updatedAt: reply.updatedAt instanceof Date ? reply.updatedAt.toISOString() : reply.updatedAt,
        likes: reply.likes || 0
      }));
    }
    delete ret._id;
    delete ret.__v;
  }
});
MessageSchema.set("toObject", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.channelId = ret.channelId ? ret.channelId.toString() : null;
    ret.conversationId = ret.conversationId ? ret.conversationId.toString() : null;
    ret.userId = ret.userId ? ret.userId.toString() : null;
    ret.parentMessageId = ret.parentMessageId ? ret.parentMessageId.toString() : null;
    ret.likedBy = ret.likedBy.map((id) => id.toString());
    ret.content = ret.content || "";
    ret.fileUrl = ret.fileUrl.toString();
    ret.fileName = ret.fileName.toString();
    ret.createdAt = ret.createdAt instanceof Date ? ret.createdAt.toISOString() : ret.createdAt;
    ret.updatedAt = ret.updatedAt instanceof Date ? ret.updatedAt.toISOString() : ret.updatedAt;
    ret.content = ret.content || "";
    if (ret.replies && Array.isArray(ret.replies)) {
      ret.replies = ret.replies.map((reply) => ({
        id: reply._id ? reply._id.toString() : void 0,
        userId: reply.userId ? reply.userId.toString() : null,
        content: reply.content,
        fileUrl: reply.fileUrl,
        fileName: reply.fileName,
        conversationId: reply.conversationId ? reply.conversationId.toString() : null,
        channelId: reply.channelId ? reply.channelId.toString() : null,
        parentMessageId: reply.parentMessageId ? reply.parentMessageId.toString() : null,
        createdAt: reply.createdAt instanceof Date ? reply.createdAt.toISOString() : reply.createdAt,
        updatedAt: reply.updatedAt instanceof Date ? reply.updatedAt.toISOString() : reply.updatedAt,
        likes: reply.likes || 0
      }));
    }
    delete ret._id;
    delete ret.__v;
  }
});
MessageSchema.index({ content: "text" });
MessageSchema.pre(/^find/, function(next) {
  this.populate("replies");
  next();
});
var Message_default = MessageSchema;

// src/types/User.ts
import mongoose3 from "mongoose";
var ROLES = {
  ADMIN: "admin",
  MEMBER: "member"
};
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
    role: { type: String, enum: ["admin", "member"], default: "member" },
    organizationAddress: { type: String }
  },
  { timestamps: true }
);
userSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id.toString();
    ret.organizationId = ret.organizationId ? ret.organizationId.toString() : null;
    ret.createdAt = ret.createdAt ? ret.createdAt.toString() : null;
    ret.updatedAt = ret.updatedAt ? ret.updatedAt.toString() : null;
    ret.description = ret.description ? ret.description.toString() : null;
    ret.avatar = ret.avatar ? ret.avatar.toString() : null;
    ret.organizationAddress = ret.organizationAddress ? ret.organizationAddress.toString() : null;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});
var User_default = userSchema;

// src/types/Conversation.ts
import mongoose4 from "mongoose";
var ConversationSchema = new mongoose4.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "channel"],
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
        return this.type === "direct";
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
        return this.type === "channel";
      }
    },
    description: {
      type: String
      // Optional for 'channel' type
    },
    uniqueKey: {
      type: String,
      unique: true,
      sparse: true
      // Only applicable for direct conversations
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    archived: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
ConversationSchema.pre("save", function(next) {
  if (this.type === "direct") {
    const sortedParticipants = this.participants.map((id) => id.toString()).sort();
    this.uniqueKey = sortedParticipants.join("_");
  }
  next();
});
ConversationSchema.index(
  { uniqueKey: 1, organizationId: 1 },
  { unique: true, sparse: true }
);
ConversationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});
var Conversation_default = ConversationSchema;

// src/types/Organization.ts
import mongoose5 from "mongoose";
var organizationSchema = new mongoose5.Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);
organizationSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});
var Organization_default = organizationSchema;

// src/types/DirectMessage.ts
import mongoose6 from "mongoose";
var { Schema: Schema4 } = mongoose6;
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
  DirectMessage_default as DirectMessageSchema,
  MessageHistory_default as MessageHistorySchema,
  MessageMetadataSchema,
  ROLES,
  Conversation_default as conversationSchema,
  Message_default as messageSchema,
  Organization_default as organizationSchema,
  User_default as userSchema
};
