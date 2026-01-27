import { configureStore } from '@reduxjs/toolkit';
import problemsReducer from './problemsSlice';

export const store = configureStore({
  reducer: {
    problems: problemsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['problems/setProblems', 'problems/addProblem', 'problems/updateProblemStatus'],
        ignoredPaths: ['problems.problems'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;