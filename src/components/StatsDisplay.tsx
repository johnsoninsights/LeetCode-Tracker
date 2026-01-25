'use client';

import type { Problem } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Target, Award, Clock } from 'lucide-react';

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

  // Custom label component that's more compact
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (totalProblems === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl mb-6 border border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Your Progress
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Add some problems to see your stats!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl mb-6 border border-gray-200/50 dark:border-gray-700/50">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
        Your Progress
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-white/80" />
          </div>
          <p className="text-sm text-white/80 font-medium">Total Problems</p>
          <p className="text-3xl font-bold text-white">{totalProblems}</p>
        </div>

        <div className="group bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-6 h-6 text-white/80" />
          </div>
          <p className="text-sm text-white/80 font-medium">Solved</p>
          <p className="text-3xl font-bold text-white">{solvedCount}</p>
        </div>

        <div className="group bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <p className="text-sm text-white/80 font-medium">Success Rate</p>
          <p className="text-3xl font-bold text-white">{solvedPercentage}%</p>
        </div>

        <div className="group bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-white/80" />
          </div>
          <p className="text-sm text-white/80 font-medium">In Progress</p>
          <p className="text-3xl font-bold text-white">{statusCounts['Attempted']}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Status Breakdown</h3>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={70}
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
            <div className="mt-4 space-y-2 w-full">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-gray-700 dark:text-gray-300">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Difficulty Breakdown</h3>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={70}
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
            <div className="mt-4 space-y-2 w-full">
              {difficultyData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-gray-700 dark:text-gray-300">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}