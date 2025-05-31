import { Mongoose } from "mongoose";
import { IOrganizationDocument, OrganizationDTO } from "./types"

/**
 * Transforms an organization document into a DTO format.
 * @param organization - The organization document to transform.
 * @returns The transformed organization DTO.
 */
export const transformToOrganizationDTO = (organization: IOrganizationDocument): OrganizationDTO => {
  return {
    id: organization.id,
    name: organization.name,
    createdAt: organization.createdAt.toISOString(),
    updatedAt: organization.updatedAt.toISOString(),
  };
}