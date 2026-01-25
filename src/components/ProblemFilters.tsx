'use client';

import type { Difficulty, Status } from '@/types';

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
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter Problems</h3>
      
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty | 'All')}
            className="p-2 border border-gray-300 rounded"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as Status | 'All')}
            className="p-2 border border-gray-300 rounded"
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