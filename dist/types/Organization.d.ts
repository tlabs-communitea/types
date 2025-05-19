import { Document, Model } from 'mongoose';
export interface IOrganization {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IOrganizationDocument extends IOrganization, Document {
}
declare const Organization: Model<IOrganizationDocument>;
export default Organization;
//# sourceMappingURL=Organization.d.ts.map