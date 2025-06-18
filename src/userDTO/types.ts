import { Types, Document } from 'mongoose';

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export const REASON_FOR_LOCK = {
  PENDING_APPROVAL: 'pending approval',
  ADMIN_LOCK: 'admin lock',
  UNLOCKED: 'unlocked',
} as const;

export type ReasonForLock = typeof REASON_FOR_LOCK[keyof typeof REASON_FOR_LOCK];
export type Role = typeof ROLES[keyof typeof ROLES];

export interface PromptAnswer {
  question: string;
  answer: string;
}

export interface UserMetadata {
  interests: string[];
  prompts: PromptAnswer[];

  pronouns: string;

  lifeSituation: string;

  work: string;
  education: string;
  gender: string;
  lookingFor: string;

  sexuality: string;
  relationshipStatus: string;
  hasKids: boolean;
  religion: string;
  smoking: boolean;
  drinking: boolean;
  newToArea: boolean;
  starSign: string;
  pets: boolean;
}

// This interface represents the shape of the User document in MongoDB
export interface IUser {
  name: string;
  email: string;
  password: string; // Hashed password
  resetPasswordToken?: string; // Note: Mongoose schema uses String, not string
  resetPasswordTokenExpires?: Date;
  avatar?: string;
  description?: string;
  organizationId: Types.ObjectId;
  role: Role;
  organizationAddress?: string;
  isLocked: boolean; // indicates if the user account is locked by the admin
  createdAt: Date;
  updatedAt: Date;
  reasonForLock: ReasonForLock;

  metadata?: UserMetadata;
}

// This interface includes Mongoose Document properties like _id, and methods.
export interface IUserDocument extends IUser, Document {
  // You can add any custom methods for your User model here if needed
  // For example:
  // comparePassword(candidatePassword: string): Promise<boolean>;
}

type MongooseSpecificTypes = keyof Document;
export type CreateUser = Omit<IUserDocument, MongooseSpecificTypes>;


export interface UserDTO {
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
}

export interface PublicUserDTO {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  description: string | null;
  organizationId: string;
  role: Role;
  metadata: UserMetadata;
}