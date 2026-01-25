// types/index.ts

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Status = 
  | 'Not Attempted' 
  | 'Attempted' 
  | 'Solved with Help' 
  | 'Solved Independently';

export type AlgorithmTag = 
  | 'Arrays'
  | 'Strings'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Hash Maps'
  | 'Linked Lists'
  | 'Trees'
  | 'Graphs'
  | 'Dynamic Programming'
  | 'Backtracking'
  | 'Binary Search'
  | 'Sorting'
  | 'Other';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: AlgorithmTag[];
  leetcodeNumber?: number;
  url?: string;
  status: Status;
  createdAt: Date;
  lastAttemptedAt?: Date;
  notes?: string;
  solution?: string; // Add solution field
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD format
  count: number; // number of problems worked on that day
}