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
      case 'Easy': return 'text-green-700 bg-green-100 font-semibold';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 font-semibold';
      case 'Hard': return 'text-red-700 bg-red-100 font-semibold';
      default: return 'text-gray-700 bg-gray-100 font-semibold';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Attempted': return 'bg-gray-300 text-gray-900 font-medium';
      case 'Attempted': return 'bg-blue-300 text-blue-900 font-medium';
      case 'Solved with Help': return 'bg-yellow-300 text-yellow-900 font-medium';
      case 'Solved Independently': return 'bg-green-300 text-green-900 font-medium';
      default: return 'bg-gray-300 text-gray-900 font-medium';
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
      <div className="text-center py-8 text-gray-700 text-lg">
        No problems added yet. Add your first problem above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">My Problems ({problems.length})</h2>
      {problems.map(problem => (
        <div key={problem.id} className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{problem.title}</h3>
              {problem.leetcodeNumber && (
                <span className="text-sm text-gray-700 font-medium">#{problem.leetcodeNumber}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded text-sm ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <button
                onClick={() => onDeleteProblem(problem.id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mb-2">
            <select
              value={problem.status}
              onChange={(e) => onUpdateStatus(problem.id, e.target.value as Status)}
              className={`px-3 py-1 rounded text-sm cursor-pointer border-2 border-gray-300 ${getStatusColor(problem.status)}`}
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
              <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-900 rounded text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>

          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm mt-2 inline-block hover:underline font-medium"
            >
              View Problem →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}