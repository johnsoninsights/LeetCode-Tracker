'use client';

import type { Problem } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatsDisplayProps {
  problems: Problem[];
}

export default function StatsDisplay({ problems }: StatsDisplayProps) {
  const totalProblems = problems.length;
  
  const statusCounts = {
    'Not Attempted': 0,
    'Attempted': 0,
    'Solved with Help': 0,
    'Solved Independently': 0,
  };

  const difficultyCounts = {
    'Easy': 0,
    'Medium': 0,
    'Hard': 0,
  };

  problems.forEach(problem => {
    statusCounts[problem.status]++;
    difficultyCounts[problem.difficulty]++;
  });

  const statusData = [
    { name: 'Not Attempted', value: statusCounts['Not Attempted'], color: '#9CA3AF' },
    { name: 'Attempted', value: statusCounts['Attempted'], color: '#60A5FA' },
    { name: 'Solved with Help', value: statusCounts['Solved with Help'], color: '#FBBF24' },
    { name: 'Solved Independently', value: statusCounts['Solved Independently'], color: '#34D399' },
  ].filter(item => item.value > 0);

  const difficultyData = [
    { name: 'Easy', value: difficultyCounts['Easy'], color: '#34D399' },
    { name: 'Medium', value: difficultyCounts['Medium'], color: '#FBBF24' },
    { name: 'Hard', value: difficultyCounts['Hard'], color: '#EF4444' },
  ].filter(item => item.value > 0);

  const solvedCount = statusCounts['Solved with Help'] + statusCounts['Solved Independently'];
  const solvedPercentage = totalProblems > 0 ? ((solvedCount / totalProblems) * 100).toFixed(1) : 0;

  if (totalProblems === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border-2 border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Progress</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">Add some problems to see your stats!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border-2 border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Progress</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Total Problems</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalProblems}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg border-2 border-green-200 dark:border-green-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Solved</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{solvedCount}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Success Rate</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{solvedPercentage}%</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{statusCounts['Attempted']}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold mb-3 text-center text-gray-900 dark:text-gray-100">Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-3 text-center text-gray-900 dark:text-gray-100">Difficulty Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}