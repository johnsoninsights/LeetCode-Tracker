'use client';

import { useState } from 'react';
import type { Problem, Status } from '@/types';
import { Trash2, ExternalLink, Hash, FileText } from 'lucide-react';
import NotesModal from './NotesModal';

interface ProblemListProps {
  problems: Problem[];
  onUpdateStatus: (problemId: string, newStatus: Status) => void;
  onDeleteProblem: (problemId: string) => void;
  onUpdateNotes: (problemId: string, notes: string) => void;
}

export default function ProblemList({ problems, onUpdateStatus, onDeleteProblem, onUpdateNotes }: ProblemListProps) {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'Hard': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Attempted': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600';
      case 'Attempted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700';
      case 'Solved with Help': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
      case 'Solved Independently': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600';
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
      <div className="text-center py-12 text-gray-600 dark:text-gray-400 text-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
        <p className="text-2xl mb-2">🎯</p>
        <p>No problems yet. Add your first problem above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Hash className="w-6 h-6" />
          My Problems ({problems.length})
        </h2>
        {problems.map((problem, index) => (
          <div 
            key={problem.id} 
            className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-[1.02] animate-slide-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {problem.title}
                </h3>
                {problem.leetcodeNumber && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Hash className="w-4 h-4" />
                    <span className="font-medium">{problem.leetcodeNumber}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold shadow-md ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <button
                  onClick={() => setSelectedProblem(problem)}
                  className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 hover:scale-110 shadow-md"
                  aria-label="View notes"
                  title={problem.notes ? 'View/Edit Notes' : 'Add Notes'}
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDeleteProblem(problem.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-110 shadow-md"
                  aria-label="Delete problem"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <select
                value={problem.status}
                onChange={(e) => onUpdateStatus(problem.id, e.target.value as Status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-2 transition-all ${getStatusColor(problem.status)}`}
              >
                {allStatuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {problem.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-200 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-800">
                  {tag}
                </span>
              ))}
            </div>

            {problem.notes && (
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Notes Preview:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{problem.notes}</p>
              </div>
            )}

            {problem.url && (
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline group/link"
              >
                <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                View Problem
              </a>
            )}
          </div>
        ))}
      </div>

      {selectedProblem && (
        <NotesModal
          problem={selectedProblem}
          isOpen={!!selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onSave={onUpdateNotes}
        />
      )}
    </>
  );
}