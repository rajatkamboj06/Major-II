import { Request, Response } from 'express';
import Pipeline from '../models/Pipeline';
import ExecutionLog from '../models/ExecutionLog';
import { generatePipelineFromPrompt } from '../services/aiService';
import { executePipeline } from '../services/executionService';

export const createPipelineFromPrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, name, githubRepo, githubBranch } = req.body;

    if (!prompt || !name) {
      res.status(400).json({ message: 'Name and prompt are required' });
      return;
    }

    // Call the AI Service
    const aiResponse = await generatePipelineFromPrompt(prompt);

    // Save to Database
    const pipeline = await Pipeline.create({
      userId: null,
      name,
      prompt,
      githubRepo: githubRepo || '',
      githubBranch: githubBranch || 'main',
      nodes: aiResponse.nodes || [],
      edges: aiResponse.edges || [],
      status: 'draft',
    });

    res.status(201).json(pipeline);
    
    // Trigger Execution asynchronously
    executePipeline(pipeline._id.toString());
    
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error generating pipeline' });
  }
};

export const getUserPipelines = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pipelines = await Pipeline.find().sort({ createdAt: -1 });
    res.json(pipelines);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pipelines' });
  }
};

export const getPipelineById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pipeline = await Pipeline.findById(req.params.id);
    if (pipeline) {
      res.json(pipeline);
    } else {
      res.status(404).json({ message: 'Pipeline not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pipeline' });
  }
};

export const deletePipeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const pipeline = await Pipeline.findById(req.params.id);
    if (!pipeline) {
      res.status(404).json({ message: 'Pipeline not found' });
      return;
    }

    // Don't allow deleting running pipelines
    if (pipeline.status === 'running') {
      res.status(400).json({ message: 'Cannot delete a running pipeline' });
      return;
    }

    // Delete associated logs
    await ExecutionLog.deleteMany({ pipelineId: pipeline._id });
    await Pipeline.findByIdAndDelete(req.params.id);

    res.json({ message: 'Pipeline deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting pipeline' });
  }
};

export const rerunPipeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const pipeline = await Pipeline.findById(req.params.id);
    if (!pipeline) {
      res.status(404).json({ message: 'Pipeline not found' });
      return;
    }

    if (pipeline.status === 'running') {
      res.status(400).json({ message: 'Pipeline is already running' });
      return;
    }

    // Clear old logs
    await ExecutionLog.deleteMany({ pipelineId: pipeline._id });

    // Reset status
    pipeline.status = 'draft';
    await pipeline.save();

    res.json(pipeline);

    // Trigger execution
    executePipeline(pipeline._id.toString());
  } catch (error) {
    res.status(500).json({ message: 'Server error re-running pipeline' });
  }
};
