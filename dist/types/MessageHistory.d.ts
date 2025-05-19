import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    messageId: any;
    operation: "create" | "update" | "delete";
    modifiedBy: any;
    before?: any;
    after?: any;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=MessageHistory.d.ts.map