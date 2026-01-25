'use client';

import { useState } from 'react';
import ProblemForm from '@/components/ProblemForm';
import ProblemList from '@/components/ProblemList';
import type { Problem, Status } from '@/types';

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);

  const handleAddProblem = (newProblem: Problem) => {
    setProblems([...problems, newProblem]);
  };

  const handleUpdateStatus = (problemId: string, newStatus: Status) => {
    setProblems(problems.map(problem => 
      problem.id === problemId 
        ? { ...problem, status: newStatus, lastAttemptedAt: new Date() }
        : problem
    ));
  };

  const handleDeleteProblem = (problemId: string) => {
    setProblems(problems.filter(problem => problem.id !== problemId));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          LeetCode Progress Tracker
        </h1>

        <div className="mb-8">
          <ProblemForm onAddProblem={handleAddProblem} />
        </div>

        <ProblemList 
          problems={problems} 
          onUpdateStatus={handleUpdateStatus}
          onDeleteProblem={handleDeleteProblem}
        />
      </div>
    </main>
  );
}