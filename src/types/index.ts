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
  leetcodeNumber?: number; // Optional: actual LeetCode problem number
  url?: string; // Link to the problem
  status: Status;
  createdAt: Date;
  lastAttemptedAt?: Date;
}

export interface Attempt {
  id: string;
  problemId: string;
  attemptDate: Date;
  timeSpentMinutes: number;
  solved: boolean;
  neededHints: boolean;
  confidenceLevel: 1 | 2 | 3 | 4 | 5; // 1 = not confident, 5 = very confident
  notes?: string;
  solutionCode?: string;
}