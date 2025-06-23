import { IUserDocument, UserDTO, PublicUserDTO, REASON_FOR_LOCK, UserMetadata } from "./types";
import { Types } from "mongoose";

const defaultUserMetadata = (): UserMetadata => ({
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
})    

/**
 * Transforms a user document into a DTO format.
 * @param user - The user document to transform.
 * @returns The transformed user DTO.
 */
export const userTransformToDTO = (user: IUserDocument): UserDTO => {

    const transformedUser: UserDTO = {
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
        isLocked: user.isLocked,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        reasonForLock: user.reasonForLock || REASON_FOR_LOCK.UNLOCKED,
        metadata: user.metadata || defaultUserMetadata(),
    }
    return transformedUser;
}


/**
 * Transforms a user document into a public DTO format, exposing only necessary fields.
 * @param user - The user document to transform.
 * @returns The transformed public user DTO.
 */
export const userTransformToPublicDTO = (user: IUserDocument): PublicUserDTO => {
    return {
        id: (user._id as Types.ObjectId).toString(),
        name: user.name,
        email: user.email, // Included for general identification
        avatar: user.avatar || null,
        description: user.description || null,
        organizationId: user.organizationId.toString(),
        role: user.role,
        // Optionally include createdAt and updatedAt if useful for display
        // createdAt: user.createdAt.toISOString(),
        // updatedAt: user.updatedAt.toISOString(),
        metadata: user.metadata || defaultUserMetadata(),
    };
};