import mongoose, { Model, Types, Document } from 'mongoose';

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

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
}

export interface PublicUserDTO {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  description: string | null;
  organizationId: string;
  role: Role;
}