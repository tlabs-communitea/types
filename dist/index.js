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
  Conversation: () => Conversation_default
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
  },
  { timestamps: true }
);
var MessageHistory_default = import_mongoose.default.model("MessageHistory", MessageHistorySchema);

// src/types/Message.ts
var import_mongoose2 = __toESM(require("mongoose"));
var MessageSchema = new import_mongoose2.default.Schema(
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
    channelId: {
      type: import_mongoose2.Schema.Types.ObjectId,
      ref: "Channel",
      default: null,
      index: true
    },
    parentMessageId: {
      type: import_mongoose2.Schema.Types.ObjectId,
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
      type: [import_mongoose2.Schema.Types.ObjectId],
      ref: "User",
      default: []
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
var Message_default = import_mongoose2.default.model("Message", MessageSchema);

// src/types/User.ts
var import_mongoose3 = __toESM(require("mongoose"));
var userSchema = new import_mongoose3.default.Schema({
  // Use IUserDocument here
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordTokenExpires: { type: Date },
  avatar: { type: String },
  description: { type: String },
  organizationId: { type: import_mongoose3.default.Schema.Types.ObjectId, ref: "Organization", required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  organizationAddress: { type: String }
}, { timestamps: true });
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
var User = import_mongoose3.default.model("User", userSchema);

// src/types/Conversation.ts
var import_mongoose4 = __toESM(require("mongoose"));
var ConversationSchema = new import_mongoose4.default.Schema({
  type: {
    type: String,
    enum: ["direct", "channel"],
    required: true
  },
  participants: {
    type: [{
      type: import_mongoose4.default.Schema.Types.ObjectId,
      ref: "User"
    }],
    required: function() {
      return this.type === "direct";
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
}, { timestamps: true });
ConversationSchema.pre("save", function(next) {
  if (this.type === "direct") {
    const sortedParticipants = this.participants.map((id) => id.toString()).sort();
    this.uniqueKey = sortedParticipants.join("_");
  }
  next();
});
ConversationSchema.index({ uniqueKey: 1, organizationId: 1 }, { unique: true, sparse: true });
ConversationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});
var Conversation_default = import_mongoose4.default.model("Conversation", ConversationSchema);

// src/types/Organization.ts
var import_mongoose5 = __toESM(require("mongoose"));
var organizationSchema = new import_mongoose5.default.Schema({
  name: { type: String, required: true }
}, { timestamps: true });
organizationSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});
var Organization = import_mongoose5.default.model("Organization", organizationSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Conversation
});
