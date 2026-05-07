import mongoose from 'mongoose';
declare const Pipeline: mongoose.Model<{
    name: string;
    prompt: string;
    githubRepo: string;
    githubBranch: string;
    nodes: mongoose.Types.DocumentArray<{
        id: string;
        type: string;
        data: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: string;
        data: any;
    }, {}, {}> & {
        id: string;
        type: string;
        data: any;
    }>;
    edges: mongoose.Types.DocumentArray<{
        id: string;
        source: string;
        target: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        source: string;
        target: string;
    }, {}, {}> & {
        id: string;
        source: string;
        target: string;
    }>;
    status: "draft" | "running" | "success" | "failed";
    userId?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    prompt: string;
    githubRepo: string;
    githubBranch: string;
    nodes: mongoose.Types.DocumentArray<{
        id: string;
        type: string;
        data: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: string;
        data: any;
    }, {}, {}> & {
        id: string;
        type: string;
        data: any;
    }>;
    edges: mongoose.Types.DocumentArray<{
        id: string;
        source: string;
        target: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        source: string;
        target: string;
    }, {}, {}> & {
        id: string;
        source: string;
        target: string;
    }>;
    status: "draft" | "running" | "success" | "failed";
    userId?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    prompt: string;
    githubRepo: string;
    githubBranch: string;
    nodes: mongoose.Types.DocumentArray<{
        id: string;
        type: string;
        data: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: string;
        data: any;
    }, {}, {}> & {
        id: string;
        type: string;
        data: any;
    }>;
    edges: mongoose.Types.DocumentArray<{
        id: string;
        source: string;
        target: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        source: string;
        target: string;
    }, {}, {}> & {
        id: string;
        source: string;
        target: string;
    }>;
    status: "draft" | "running" | "success" | "failed";
    userId?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    prompt: string;
    githubRepo: string;
    githubBranch: string;
    nodes: mongoose.Types.DocumentArray<{
        id: string;
        type: string;
        data: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: string;
        data: any;
    }, {}, {}> & {
        id: string;
        type: string;
        data: any;
    }>;
    edges: mongoose.Types.DocumentArray<{
        id: string;
        source: string;
        target: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        source: string;
        target: string;
    }, {}, {}> & {
        id: string;
        source: string;
        target: string;
    }>;
    status: "draft" | "running" | "success" | "failed";
    userId?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    prompt: string;
    githubRepo: string;
    githubBranch: string;
    nodes: mongoose.Types.DocumentArray<{
        id: string;
        type: string;
        data: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: string;
        data: any;
    }, {}, {}> & {
        id: string;
        type: string;
        data: any;
    }>;
    edges: mongoose.Types.DocumentArray<{
        id: string;
        source: string;
        target: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        source: string;
        target: string;
    }, {}, {}> & {
        id: string;
        source: string;
        target: string;
    }>;
    status: "draft" | "running" | "success" | "failed";
    userId?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    name: string;
    prompt: string;
    githubRepo: string;
    githubBranch: string;
    nodes: mongoose.Types.DocumentArray<{
        id: string;
        type: string;
        data: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: string;
        data: any;
    }, {}, {}> & {
        id: string;
        type: string;
        data: any;
    }>;
    edges: mongoose.Types.DocumentArray<{
        id: string;
        source: string;
        target: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        source: string;
        target: string;
    }, {}, {}> & {
        id: string;
        source: string;
        target: string;
    }>;
    status: "draft" | "running" | "success" | "failed";
    userId?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    prompt: string;
    githubRepo: string;
    githubBranch: string;
    nodes: mongoose.Types.DocumentArray<{
        id: string;
        type: string;
        data: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: string;
        data: any;
    }, {}, {}> & {
        id: string;
        type: string;
        data: any;
    }>;
    edges: mongoose.Types.DocumentArray<{
        id: string;
        source: string;
        target: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        source: string;
        target: string;
    }, {}, {}> & {
        id: string;
        source: string;
        target: string;
    }>;
    status: "draft" | "running" | "success" | "failed";
    userId?: mongoose.Types.ObjectId | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    prompt: string;
    githubRepo: string;
    githubBranch: string;
    nodes: mongoose.Types.DocumentArray<{
        id: string;
        type: string;
        data: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: string;
        data: any;
    }, {}, {}> & {
        id: string;
        type: string;
        data: any;
    }>;
    edges: mongoose.Types.DocumentArray<{
        id: string;
        source: string;
        target: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        source: string;
        target: string;
    }, {}, {}> & {
        id: string;
        source: string;
        target: string;
    }>;
    status: "draft" | "running" | "success" | "failed";
    userId?: mongoose.Types.ObjectId | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Pipeline;
