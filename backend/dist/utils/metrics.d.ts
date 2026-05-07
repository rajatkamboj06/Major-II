import client from 'prom-client';
export declare const register: client.Registry<"text/plain; version=0.0.4; charset=utf-8">;
export declare const pipelineTotalCounter: client.Counter<"status">;
export declare const stepDurationHistogram: client.Histogram<"step_type">;
export declare const vulnerabilitiesGauge: client.Gauge<"severity" | "scanner">;
export declare const logCounter: client.Counter<"level">;
