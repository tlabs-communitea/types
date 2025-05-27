import { Document } from 'mongoose';
export interface IOrganization {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationDocument extends IOrganization, Document {}

type MongooseSpecificTypes = keyof Document;
export type CreateOrganization = Omit<IOrganizationDocument, MongooseSpecificTypes>;


export interface OrganizationDTO {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}