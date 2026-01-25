import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Problem, Status } from '@/types';

interface ProblemsState {
  problems: Problem[];
  loading: boolean;
  error: string | null;
}

const initialState: ProblemsState = {
  problems: [],
  loading: false,
  error: null,
};

const problemsSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    setProblems: (state, action: PayloadAction<Problem[]>) => {
      state.problems = action.payload;
      state.loading = false;
    },
    addProblem: (state, action: PayloadAction<Problem>) => {
      state.problems.push(action.payload);
    },
    updateProblemStatus: (state, action: PayloadAction<{ id: string; status: Status }>) => {
      const problem = state.problems.find(p => p.id === action.payload.id);
      if (problem) {
        problem.status = action.payload.status;
        problem.lastAttemptedAt = new Date();
      }
    },
    removeProblem: (state, action: PayloadAction<string>) => {
      state.problems = state.problems.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setProblems,
  addProblem,
  updateProblemStatus,
  removeProblem,
  setLoading,
  setError,
} = problemsSlice.actions;

export default problemsSlice.reducer;