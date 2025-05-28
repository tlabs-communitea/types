import { IUserDocument, UserDTO } from "./types";
import mongoose, { Types } from "mongoose";

/**
 * Transforms a user document into a DTO format.
 * @param user - The user document to transform.
 * @returns The transformed user DTO.
 */
export const userTransformToDTO = (user: IUserDocument): UserDTO => {

    const transformedUser : UserDTO = {
        id: (user._id as Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        password: user.password, 
        resetPasswordToken: user.resetPasswordToken || null,
        resetPasswordTokenExpires: user.resetPasswordTokenExpires
            ? user.resetPasswordTokenExpires.toISOString()
            : null,
        avatar: user.avatar || null,
        description: user.description || null,
        organizationId: user.organizationId.toString(),
        role: user.role,
        organizationAddress: user.organizationAddress || null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    }
    return transformedUser;
}