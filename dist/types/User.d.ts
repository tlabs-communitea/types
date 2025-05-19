import { Model, Types, Document } from 'mongoose';
export interface IUser {
    name: string;
    email: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordTokenExpires?: Date;
    avatar?: string;
    description?: string;
    organizationId: Types.ObjectId;
    role: 'admin' | 'member';
    organizationAddress?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IUserDocument extends IUser, Document {
}
declare const User: Model<IUserDocument>;
export default User;
//# sourceMappingURL=User.d.ts.map