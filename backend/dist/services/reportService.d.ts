export declare const generateSonarQubeReport: (pipelineId: string, stepIndex: number, duration: number, rawData?: any) => Promise<import("mongoose").Document<unknown, {}, {
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
export declare const generateTrivyReport: (pipelineId: string, stepIndex: number, duration: number, rawData?: any) => Promise<import("mongoose").Document<unknown, {}, {
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
export declare const generateSnykReport: (pipelineId: string, stepIndex: number, duration: number, rawData?: any) => Promise<import("mongoose").Document<unknown, {}, {
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
export declare const generateDockerBuildReport: (pipelineId: string, stepIndex: number, duration: number) => Promise<import("mongoose").Document<unknown, {}, {
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
export declare const generateNpmAuditReport: (pipelineId: string, stepIndex: number, duration: number) => Promise<import("mongoose").Document<unknown, {}, {
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
export declare const generateTestCoverageReport: (pipelineId: string, stepIndex: number, stepType: string, duration: number) => Promise<import("mongoose").Document<unknown, {}, {
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
export declare const generateDeploymentReport: (pipelineId: string, stepIndex: number, stepType: string, duration: number) => Promise<import("mongoose").Document<unknown, {}, {
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    pipelineId: import("mongoose").Types.ObjectId;
    stepIndex: number;
    stepType: string;
    reportType: "sonarqube" | "docker_build" | "snyk" | "trivy" | "npm_audit" | "test_coverage" | "deployment";
    findings: import("mongoose").Types.DocumentArray<{
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
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
