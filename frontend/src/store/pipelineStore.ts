import { create } from 'zustand';

interface Pipeline {
  _id: string;
  name: string;
  prompt: string;
  status: string;
  nodes: any[];
  edges: any[];
  createdAt: string;
  updatedAt: string;
}

interface PipelineState {
  pipelines: Pipeline[];
  currentPipeline: Pipeline | null;
  isLoading: boolean;
  setPipelines: (pipelines: Pipeline[]) => void;
  setCurrentPipeline: (pipeline: Pipeline | null) => void;
  setLoading: (loading: boolean) => void;
  updatePipelineStatus: (pipelineId: string, status: string) => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
  pipelines: [],
  currentPipeline: null,
  isLoading: false,
  setPipelines: (pipelines) => set({ pipelines }),
  setCurrentPipeline: (pipeline) => set({ currentPipeline: pipeline }),
  setLoading: (loading) => set({ isLoading: loading }),
  updatePipelineStatus: (pipelineId, status) => set((state) => ({
    pipelines: state.pipelines.map((p) =>
      p._id === pipelineId ? { ...p, status } : p
    ),
    currentPipeline: state.currentPipeline?._id === pipelineId
      ? { ...state.currentPipeline, status }
      : state.currentPipeline,
  })),
}));
