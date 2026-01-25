'use client';

import type { Problem, Status } from '@/types';

interface ProblemListProps {
  problems: Problem[];
  onUpdateStatus: (problemId: string, newStatus: Status) => void;
  onDeleteProblem: (problemId: string) => void;
}

export default function ProblemList({ problems, onUpdateStatus, onDeleteProblem }: ProblemListProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Attempted': return 'bg-gray-200 text-gray-700';
      case 'Attempted': return 'bg-blue-200 text-blue-700';
      case 'Solved with Help': return 'bg-yellow-200 text-yellow-700';
      case 'Solved Independently': return 'bg-green-200 text-green-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const allStatuses: Status[] = [
    'Not Attempted',
    'Attempted',
    'Solved with Help',
    'Solved Independently'
  ];

  if (problems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No problems added yet. Add your first problem above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Problems ({problems.length})</h2>
      {problems.map(problem => (
        <div key={problem.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold">{problem.title}</h3>
              {problem.leetcodeNumber && (
                <span className="text-sm text-gray-500">#{problem.leetcodeNumber}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <button
                onClick={() => onDeleteProblem(problem.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mb-2">
            <select
              value={problem.status}
              onChange={(e) => onUpdateStatus(problem.id, e.target.value as Status)}
              className={`px-3 py-1 rounded text-sm cursor-pointer ${getStatusColor(problem.status)}`}
            >
              {allStatuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {problem.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>

          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm mt-2 inline-block hover:underline"
            >
              View Problem →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}