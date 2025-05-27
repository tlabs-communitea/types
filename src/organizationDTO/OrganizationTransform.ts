import { Mongoose } from "mongoose";
import { IOrganizationDocument, OrganizationDTO } from "./types"
export const transformToOrganizationDTO = (organization: IOrganizationDocument): OrganizationDTO => {
  return {
    id: organization.id,
    name: organization.name,
    createdAt: organization.createdAt.toISOString(),
    updatedAt: organization.updatedAt.toISOString(),
  };
}