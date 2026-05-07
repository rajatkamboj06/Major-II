import mongoose from 'mongoose';
declare const ExecutionLog: mongoose.Model<{
    message: string;
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    stepLabel: string;
    level: "success" | "info" | "warn" | "error";
    duration?: number | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    message: string;
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    stepLabel: string;
    level: "success" | "info" | "warn" | "error";
    duration?: number | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    message: string;
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    stepLabel: string;
    level: "success" | "info" | "warn" | "error";
    duration?: number | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    message: string;
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    stepLabel: string;
    level: "success" | "info" | "warn" | "error";
    duration?: number | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    message: string;
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    stepLabel: string;
    level: "success" | "info" | "warn" | "error";
    duration?: number | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    message: string;
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    stepLabel: string;
    level: "success" | "info" | "warn" | "error";
    duration?: number | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    message: string;
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    stepLabel: string;
    level: "success" | "info" | "warn" | "error";
    duration?: number | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    message: string;
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    stepLabel: string;
    level: "success" | "info" | "warn" | "error";
    duration?: number | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default ExecutionLog;
