'use client';

import { useState, useEffect } from 'react';
import ProblemForm from '@/components/ProblemForm';
import ProblemList from '@/components/ProblemList';
import type { Problem, Status } from '@/types';
import { addProblem, getProblems, updateProblemStatus, deleteProblem } from '@/lib/firebaseHelpers';

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const fetchedProblems = await getProblems();
        setProblems(fetchedProblems);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleAddProblem = async (newProblem: Problem) => {
    try {
      const docId = await addProblem(newProblem);
     
      setProblems([...problems, { ...newProblem, id: docId }]);
    } catch (error) {
      console.error('Failed to add problem:', error);
      alert('Failed to add problem. Please try again.');
    }
  };

  const handleUpdateStatus = async (problemId: string, newStatus: Status) => {
    try {
      await updateProblemStatus(problemId, newStatus);
     
      setProblems(problems.map(problem => 
        problem.id === problemId 
          ? { ...problem, status: newStatus, lastAttemptedAt: new Date() }
          : problem
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    try {
      await deleteProblem(problemId);
     
      setProblems(problems.filter(problem => problem.id !== problemId));
    } catch (error) {
      console.error('Failed to delete problem:', error);
      alert('Failed to delete problem. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </main>
    );
  }

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