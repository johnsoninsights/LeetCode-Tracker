'use client';

import type { Difficulty, Status } from '@/types';
import { Filter } from 'lucide-react';

interface ProblemFiltersProps {
  selectedDifficulty: Difficulty | 'All';
  selectedStatus: Status | 'All';
  onDifficultyChange: (difficulty: Difficulty | 'All') => void;
  onStatusChange: (status: Status | 'All') => void;
}

export default function ProblemFilters({
  selectedDifficulty,
  selectedStatus,
  onDifficultyChange,
  onStatusChange
}: ProblemFiltersProps) {
  const difficulties: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];
  const statuses: (Status | 'All')[] = [
    'All',
    'Not Attempted',
    'Attempted',
    'Solved with Help',
    'Solved Independently'
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Filter Problems</h3>
      </div>
      
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty | 'All')}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 font-medium focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as Status | 'All')}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 font-medium focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}