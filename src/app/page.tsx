'use client';

import { useEffect, useState } from 'react';
import ProblemForm from '@/components/ProblemForm';
import ProblemList from '@/components/ProblemList';
import ProblemFilters from '@/components/ProblemFilters';
import StatsDisplay from '@/components/StatsDisplay';
import ActivityTracker from '@/components/ActivityTracker';
import ThemeToggle from '@/components/ThemeToggle';
import AuthForm from '@/components/AuthForm';
import UserMenu from '@/components/UserMenu';
import type { Problem, Status, Difficulty } from '@/types';
import { 
  addProblem as addProblemToFirebase, 
  getProblems, 
  updateProblemStatus as updateStatusInFirebase, 
  updateProblemNotes as updateNotesInFirebase, 
  updateProblemSolution as updateSolutionInFirebase,
  deleteProblem as deleteProblemFromFirebase 
} from '@/lib/firebaseHelpers';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProblems, addProblem, updateProblemStatus, updateProblemNotes, updateProblemSolution, removeProblem, setLoading } from '@/store/problemsSlice';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DEMO_PROBLEMS } from '@/lib/demoData';
import SideNav from '@/components/SideNav';

export default function Home() {
  const { user, loading: authLoading, isDemo } = useAuth();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const { problems, loading } = useAppSelector((state) => state.problems);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'All'>('All');

  useEffect(() => {
    if (!user) return;

    const fetchProblems = async () => {
      dispatch(setLoading(true));
      try {
        if (isDemo) {
          // Load demo data directly into Redux without Firebase
          const demoProblems = DEMO_PROBLEMS.map((p, index) => ({
            ...p,
            id: `demo-${index}`,
          }));
          dispatch(setProblems(demoProblems));
        } else {
          const fetchedProblems = await getProblems(user.uid);
          dispatch(setProblems(fetchedProblems));
        }
      } catch (error) {
        console.error('Failed to fetch problems:', error);
        showToast('Failed to load problems', 'error');
      }
    };

    fetchProblems();
  }, [dispatch, user, isDemo, showToast]);

  const handleAddProblem = async (newProblem: Problem) => {
    if (!user) return;

    if (isDemo) {
      // In demo mode just update local state
      dispatch(addProblem({ ...newProblem, id: `demo-${Date.now()}` }));
      showToast('Problem added! (Demo mode - changes not saved) 🎉', 'info');
      return;
    }

    try {
      const docId = await addProblemToFirebase(newProblem, user.uid);
      dispatch(addProblem({ ...newProblem, id: docId }));
      showToast('Problem added successfully! 🎉', 'success');
    } catch (error) {
      console.error('Failed to add problem:', error);
      showToast('Failed to add problem. Please try again.', 'error');
    }
  };

  const handleUpdateStatus = async (problemId: string, newStatus: Status) => {
    if (isDemo) {
      dispatch(updateProblemStatus({ id: problemId, status: newStatus }));
      showToast('Status updated! (Demo mode) ✓', 'info');
      return;
    }

    try {
      await updateStatusInFirebase(problemId, newStatus);
      dispatch(updateProblemStatus({ id: problemId, status: newStatus }));
      showToast('Status updated! ✓', 'success');
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast('Failed to update status. Please try again.', 'error');
    }
  };

  const handleUpdateNotes = async (problemId: string, notes: string) => {
    if (isDemo) {
      dispatch(updateProblemNotes({ id: problemId, notes }));
      showToast('Notes saved! (Demo mode) 📝', 'info');
      return;
    }

    try {
      await updateNotesInFirebase(problemId, notes);
      dispatch(updateProblemNotes({ id: problemId, notes }));
      showToast('Notes saved! 📝', 'success');
    } catch (error) {
      console.error('Failed to update notes:', error);
      showToast('Failed to save notes. Please try again.', 'error');
    }
  };

  const handleUpdateSolution = async (problemId: string, solution: string) => {
    if (isDemo) {
      dispatch(updateProblemSolution({ id: problemId, solution }));
      showToast('Solution saved! (Demo mode) 💾', 'info');
      return;
    }

    try {
      await updateSolutionInFirebase(problemId, solution);
      dispatch(updateProblemSolution({ id: problemId, solution }));
      showToast('Solution saved! 💾', 'success');
    } catch (error) {
      console.error('Failed to update solution:', error);
      showToast('Failed to save solution. Please try again.', 'error');
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    if (isDemo) {
      dispatch(removeProblem(problemId));
      showToast('Problem deleted (Demo mode)', 'info');
      return;
    }

    try {
      await deleteProblemFromFirebase(problemId);
      dispatch(removeProblem(problemId));
      showToast('Problem deleted', 'info');
    } catch (error) {
      console.error('Failed to delete problem:', error);
      showToast('Failed to delete problem. Please try again.', 'error');
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || problem.status === selectedStatus;
    return matchesDifficulty && matchesStatus;
  });

  if (authLoading) {
    return (
<main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8 px-4 pb-24 md:pb-8">     
     <ThemeToggle />
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <ThemeToggle />
        <AuthForm />
      </div>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8 px-4">
        <ThemeToggle />
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="animate-pulse h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
            <UserMenu />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8 px-4">
      <ThemeToggle />
      <div className="max-w-6xl mx-auto">

        {/* Animated Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex-1 flex flex-col items-center relative">

            {/* Logo + Title Row */}
            <div className="flex items-center gap-4 mb-2">

              {/* Custom Animated SVG Logo */}
              <div className="relative flex-shrink-0">
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg"
                >
                  {/* Outer rotating ring */}
                  <circle
                    cx="26"
                    cy="26"
                    r="24"
                    stroke="url(#ringGradient)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    style={{ animation: 'spin 8s linear infinite', transformOrigin: '26px 26px' }}
                  />

                  {/* Inner background circle */}
                  <circle cx="26" cy="26" r="20" fill="url(#bgGradient)" />

                  {/* Code brackets < > */}
                  <path
                    d="M16 20L10 26L16 32"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                  <path
                    d="M36 20L42 26L36 32"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                  {/* Forward slash */}
                  <path
                    d="M29 18L23 34"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.9"
                  />

                  {/* Orbiting dot */}
                  <circle
                    cx="26"
                    cy="2"
                    r="3"
                    fill="url(#dotGradient)"
                    style={{ animation: 'spin 8s linear infinite', transformOrigin: '26px 26px' }}
                  />

                  {/* Gradient defs */}
                  <defs>
                    <linearGradient id="bgGradient" x1="6" y1="6" x2="46" y2="46">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient id="ringGradient" x1="0" y1="0" x2="52" y2="52">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient id="dotGradient" x1="0" y1="0" x2="6" y2="6">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Title with animated gradient */}
              <div>
                <h1
                  className="text-3xl md:text-5xl font-black tracking-tight pb-1"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 40%, #EC4899 70%, #F59E0B 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradientShift 4s ease infinite',
                  }}
                >
                  LeetCode Tracker
                </h1>
                {/* Animated underline */}
                <div
                  className="h-0.5 rounded-full mt-1"
                  style={{
                    background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)',
                    animation: 'expandLine 1s ease forwards',
                  }}
                />
              </div>
            </div>

            {/* Subtitle */}
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-mono text-gray-400 dark:text-gray-500">{'<'}</span>
              <p className="text-xs md:text-sm font-mono text-gray-500 dark:text-gray-400 tracking-wide">
                master algorithms · track your journey · ship your dreams
              </p>
              <span className="text-xs md:text-sm font-mono text-gray-400 dark:text-gray-500">{'/>'}</span>
            </div>

          </div>

          {/* User Menu */}
          <div className="ml-4 self-start mt-1">
            <UserMenu />
          </div>
        </div>

        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👀</span>
              <div>
                <p className="font-semibold text-yellow-700 dark:text-yellow-400">Demo Mode</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  You're exploring a demo — changes won't be saved. Sign up to track your real progress!
                </p>
              </div>
            </div>
            <button
              onClick={() => showToast('Sign out and create an account to save your progress!', 'info')}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold text-sm hover:from-yellow-600 hover:to-orange-600 transition-all whitespace-nowrap ml-4"
            >
              Sign Up Free
            </button>
          </div>
        )}

        <div id='progress' className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <StatsDisplay problems={problems} />
        </div>

        <div id='activity' className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <ActivityTracker problems={problems} />
        </div>

        <div id='add-problem' className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ProblemForm onAddProblem={handleAddProblem} />
        </div>

        <div id='filters' className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <ProblemFilters
            selectedDifficulty={selectedDifficulty}
            selectedStatus={selectedStatus}
            onDifficultyChange={setSelectedDifficulty}
            onStatusChange={setSelectedStatus}
          />
        </div>

        <div id='problems' className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <ProblemList
            problems={filteredProblems}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNotes={handleUpdateNotes}
            onUpdateSolution={handleUpdateSolution}
            onDeleteProblem={handleDeleteProblem}
          />
        </div>
      </div>
    </main>
  );
}