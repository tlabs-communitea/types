import { Role } from "../../userDTO/types";

export interface UserWithoutSensitiveInfo {
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
}

export type CountPerDate = Record<string,number>

export interface MostActiveConversation {
    id?: string;
    name: string;
    messageCount: number;
}

export interface UserAndMessageCount {
    userCount: number;
    messageCount: number;
}