import { Request, Response } from 'express';
export declare const createPipelineFromPrompt: (req: Request, res: Response) => Promise<void>;
export declare const getUserPipelines: (_req: Request, res: Response) => Promise<void>;
export declare const getPipelineById: (req: Request, res: Response) => Promise<void>;
export declare const deletePipeline: (req: Request, res: Response) => Promise<void>;
export declare const rerunPipeline: (req: Request, res: Response) => Promise<void>;
