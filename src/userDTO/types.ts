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

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  NON_BINARY: 'non-binary',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer not to say'
} as const;

export const SEXUALITY = {
  STRAIGHT: 'straight',
  GAY: 'gay',
  LESBIAN: 'lesbian',
  BISEXUAL: 'bisexual',
  PANSEXUAL: 'pansexual',
  ASEXUAL: 'asexual',
  QUEER: 'queer',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer not to say'
} as const;

export const RELATIONSHIP_STATUS = {
  SINGLE: 'single',
  IN_A_RELATIONSHIP: 'in a relationship',
  MARRIED: 'married',
  DIVORCED: 'divorced',
  WIDOWED: 'widowed',
  COMPLICATED: "it's complicated",
  PREFER_NOT_TO_SAY: 'prefer not to say'
} as const;

export const defaultUserMetadata = (): UserMetadata => ({
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
  pets: null,
});

export type ReasonForLock = typeof REASON_FOR_LOCK[keyof typeof REASON_FOR_LOCK];
export type Role = typeof ROLES[keyof typeof ROLES];
export type Gender = typeof GENDER[keyof typeof GENDER];
export type Sexuality = typeof SEXUALITY[keyof typeof SEXUALITY];
export type RelationshipStatus = typeof RELATIONSHIP_STATUS[keyof typeof RELATIONSHIP_STATUS];

export interface PromptAnswer {
  question: string;
  answer: string;
}

export type Nullable<T> = T | null;

export interface UserMetadata {
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
  metadata: UserMetadata;
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