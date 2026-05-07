import mongoose from 'mongoose';
declare const Report: mongoose.Model<{
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, {}, {}> & {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }>;
    duration?: number | null | undefined;
    summary?: {
        status: "failed" | "passed" | "warning";
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalFindings: number;
    } | null | undefined;
    metrics?: any;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, {}, {}> & {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }>;
    duration?: number | null | undefined;
    summary?: {
        status: "failed" | "passed" | "warning";
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalFindings: number;
    } | null | undefined;
    metrics?: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, {}, {}> & {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }>;
    duration?: number | null | undefined;
    summary?: {
        status: "failed" | "passed" | "warning";
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalFindings: number;
    } | null | undefined;
    metrics?: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, {}, {}> & {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }>;
    duration?: number | null | undefined;
    summary?: {
        status: "failed" | "passed" | "warning";
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalFindings: number;
    } | null | undefined;
    metrics?: any;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, {}, {}> & {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }>;
    duration?: number | null | undefined;
    summary?: {
        status: "failed" | "passed" | "warning";
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalFindings: number;
    } | null | undefined;
    metrics?: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, {}, {}> & {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }>;
    duration?: number | null | undefined;
    summary?: {
        status: "failed" | "passed" | "warning";
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalFindings: number;
    } | null | undefined;
    metrics?: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, {}, {}> & {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }>;
    duration?: number | null | undefined;
    summary?: {
        status: "failed" | "passed" | "warning";
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalFindings: number;
    } | null | undefined;
    metrics?: any;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    pipelineId: mongoose.Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }, {}, {}> & {
        id: string;
        description: string;
        status: "fixed" | "open" | "ignored";
        severity: "info" | "critical" | "high" | "medium" | "low";
        title: string;
        file?: string | null | undefined;
        line?: number | null | undefined;
        package?: string | null | undefined;
        installedVersion?: string | null | undefined;
        fixedVersion?: string | null | undefined;
        cveId?: string | null | undefined;
        rule?: string | null | undefined;
    }>;
    duration?: number | null | undefined;
    summary?: {
        status: "failed" | "passed" | "warning";
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalFindings: number;
    } | null | undefined;
    metrics?: any;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Report;
