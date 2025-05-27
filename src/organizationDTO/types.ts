import { Document } from 'mongoose';
export interface IOrganization {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationDocument extends IOrganization, Document {}

export interface OrganizationDTO {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}