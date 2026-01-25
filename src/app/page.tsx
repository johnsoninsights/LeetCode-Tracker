'use client';

import { useEffect, useState } from 'react';
import ProblemForm from '@/components/ProblemForm';
import ProblemList from '@/components/ProblemList';
import ProblemFilters from '@/components/ProblemFilters';
import StatsDisplay from '@/components/StatsDisplay';
import ThemeToggle from '@/components/ThemeToggle';
import AuthForm from '@/components/AuthForm';
import UserMenu from '@/components/UserMenu';
import type { Problem, Status, Difficulty } from '@/types';
import { addProblem as addProblemToFirebase, getProblems, updateProblemStatus as updateStatusInFirebase, deleteProblem as deleteProblemFromFirebase } from '@/lib/firebaseHelpers';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProblems, addProblem, updateProblemStatus, removeProblem, setLoading } from '@/store/problemsSlice';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  const { problems, loading } = useAppSelector((state) => state.problems);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'All'>('All');

  useEffect(() => {
    if (!user) return;
    
    const fetchProblems = async () => {
      dispatch(setLoading(true));
      try {
        const fetchedProblems = await getProblems(user.uid); // Pass userId
        dispatch(setProblems(fetchedProblems));
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      }
    };

    fetchProblems();
  }, [dispatch, user]);

  const handleAddProblem = async (newProblem: Problem) => {
    if (!user) return;
    
    try {
      const docId = await addProblemToFirebase(newProblem, user.uid); // Pass userId
      dispatch(addProblem({ ...newProblem, id: docId }));
    } catch (error) {
      console.error('Failed to add problem:', error);
      alert('Failed to add problem. Please try again.');
    }
  };

  const handleUpdateStatus = async (problemId: string, newStatus: Status) => {
    try {
      await updateStatusInFirebase(problemId, newStatus);
      dispatch(updateProblemStatus({ id: problemId, status: newStatus }));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    try {
      await deleteProblemFromFirebase(problemId);
      dispatch(removeProblem(problemId));
    } catch (error) {
      console.error('Failed to delete problem:', error);
      alert('Failed to delete problem. Please try again.');
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || problem.status === selectedStatus;
    return matchesDifficulty && matchesStatus;
  });

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <ThemeToggle />
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <>
        <ThemeToggle />
        <AuthForm />
      </>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <ThemeToggle />
        <UserMenu />
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <ThemeToggle />
      <UserMenu />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          LeetCode Progress Tracker
        </h1>

        <StatsDisplay problems={problems} />

        <div className="mb-8">
          <ProblemForm onAddProblem={handleAddProblem} />
        </div>

        <ProblemFilters
          selectedDifficulty={selectedDifficulty}
          selectedStatus={selectedStatus}
          onDifficultyChange={setSelectedDifficulty}
          onStatusChange={setSelectedStatus}
        />

        <ProblemList 
          problems={filteredProblems} 
          onUpdateStatus={handleUpdateStatus}
          onDeleteProblem={handleDeleteProblem}
        />
      </div>
    </main>
  );
}