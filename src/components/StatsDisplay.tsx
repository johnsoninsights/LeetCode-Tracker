'use client';

import { useState } from 'react';
import type { Problem } from '@/types';
import { TrendingUp, Target, Award, Clock } from 'lucide-react';

interface StatsDisplayProps {
  problems: Problem[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: ChartData[];
  title: string;
  total: number;
  centerLabel: string;
  centerValue: string | number;
}

function DonutChart({ data, title, total, centerLabel, centerValue }: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const size = 200;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate stroke dash values for each segment
  const segments = data.reduce((acc, item, index) => {
    const percentage = total > 0 ? item.value / total : 0;
    const dash = percentage * circumference;
    const gap = circumference - dash;
    const offset = index === 0
      ? circumference * 0.25
      : acc[index - 1].offset - acc[index - 1].dash;

    acc.push({ dash, gap, offset, percentage });
    return acc;
  }, [] as { dash: number; gap: number; offset: number; percentage: number }[]);

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 rounded-xl">
      <h3 className="text-lg font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
        {title}
      </h3>

      <div className="flex flex-col items-center">
        {/* SVG Donut Chart */}
<div className="relative rounded-full" style={{ width: size, height: size }}>
  <svg
    width={size}
    height={size}
    className="transform -rotate-90 rounded-full"
    style={{ overflow: 'visible' }}
  >
    {/* Background circle */}
    <circle
      cx={center}
      cy={center}
      r={radius}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className="text-gray-200 dark:text-gray-700"
    />

    {/* Data segments */}
    {data.map((item, index) => {
      const seg = segments[index];
      const isHovered = hoveredIndex === index;

      return (
        <circle
          key={index}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={item.color}
          strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
          strokeDasharray={`${seg.dash} ${seg.gap}`}
          strokeDashoffset={seg.offset}
          strokeLinecap="round"
          className="transition-all duration-300 cursor-pointer"
          style={{
            filter: isHovered ? `drop-shadow(0 0 6px ${item.color}80)` : 'none',
            opacity: hoveredIndex !== null && !isHovered ? 0.4 : 1,
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      );
    })}
  </svg>

  {/* Center Label */}
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    {activeItem ? (
      <>
        <p
          className="text-2xl font-bold transition-all duration-200"
          style={{ color: activeItem.color }}
        >
          {activeItem.value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-16 leading-tight">
          {activeItem.name}
        </p>
      </>
    ) : (
      <>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {centerValue}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {centerLabel}
        </p>
      </>
    )}
  </div>
</div>
        {/* Interactive Legend */}
        <div className="mt-4 space-y-2 w-full">
          {data.map((entry, index) => {
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="cursor-pointer transition-all duration-200 rounded-lg p-2"
                style={{
                  backgroundColor: isHovered ? `${entry.color}15` : 'transparent',
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-200"
                      style={{
                        backgroundColor: entry.color,
                        transform: isHovered ? 'scale(1.4)' : 'scale(1)',
                        boxShadow: isHovered ? `0 0 6px ${entry.color}` : 'none',
                      }}
                    />
                    <span className={`transition-colors duration-200 ${
                      isHovered
                        ? 'text-gray-900 dark:text-gray-100 font-semibold'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: isHovered ? entry.color : 'transparent',
                        color: isHovered ? 'white' : entry.color,
                        border: `1px solid ${entry.color}`,
                      }}
                    >
                      {percentage}%
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 w-6 text-right">
                      {entry.value}
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: entry.color,
                      boxShadow: isHovered ? `0 0 6px ${entry.color}` : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
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

  const statusData: ChartData[] = [
    { name: 'Not Attempted', value: statusCounts['Not Attempted'], color: '#9CA3AF' },
    { name: 'Attempted', value: statusCounts['Attempted'], color: '#60A5FA' },
    { name: 'Solved w/ Help', value: statusCounts['Solved with Help'], color: '#FBBF24' },
    { name: 'Solved Independently', value: statusCounts['Solved Independently'], color: '#34D399' },
  ].filter(item => item.value > 0);

  const difficultyData: ChartData[] = [
    { name: 'Easy', value: difficultyCounts['Easy'], color: '#34D399' },
    { name: 'Medium', value: difficultyCounts['Medium'], color: '#FBBF24' },
    { name: 'Hard', value: difficultyCounts['Hard'], color: '#EF4444' },
  ].filter(item => item.value > 0);

  const solvedCount = statusCounts['Solved with Help'] + statusCounts['Solved Independently'];
  const solvedPercentage = totalProblems > 0 ? ((solvedCount / totalProblems) * 100).toFixed(1) : 0;
  const notAttemptedCount = statusCounts['Not Attempted'];

  if (totalProblems === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl mb-6 border border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent pb-1">
          Your Progress
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Add some problems to see your stats!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl mb-6 border border-gray-200/50 dark:border-gray-700/50">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent pb-1">
        Your Progress
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        {/* Total Problems */}
        <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
          <div className="flex items-start justify-between">
            <div className="z-10 relative">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-white/80 mb-2" />
              <p className="text-xs md:text-sm text-white/80 font-medium">Total Problems</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{totalProblems}</p>
            </div>
            <div className="grid grid-cols-3 gap-1 opacity-30">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white" />
              ))}
            </div>
          </div>
          <div className="mt-3 relative z-10">
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div className="bg-white/70 h-1.5 rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="text-xs text-white/60 mt-1">all time</p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-white/10 text-8xl pointer-events-none select-none">🎯</div>
        </div>

        {/* Solved */}
        <div className="group bg-gradient-to-br from-green-500 to-green-600 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
          <div className="flex items-start justify-between">
            <div className="z-10 relative">
              <Award className="w-5 h-5 md:w-6 md:h-6 text-white/80 mb-2" />
              <p className="text-xs md:text-sm text-white/80 font-medium">Solved</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{solvedCount}</p>
            </div>
            <div className="flex flex-col gap-1 opacity-30">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-2 rounded-full bg-white ${i < Math.min(4, solvedCount) ? 'w-8' : 'w-4'}`} />
              ))}
            </div>
          </div>
          <div className="mt-3 relative z-10">
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-white/70 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-white/60 mt-1">of {totalProblems} total</p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-white/10 text-8xl pointer-events-none select-none">🏆</div>
        </div>

        {/* Success Rate */}
        <div className="group bg-gradient-to-br from-purple-500 to-purple-600 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
          <div className="flex items-start justify-between">
            <div className="z-10 relative">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white/80 mb-2" />
              <p className="text-xs md:text-sm text-white/80 font-medium">Success Rate</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{solvedPercentage}%</p>
            </div>
            <div className="flex items-end gap-0.5 h-12 opacity-40">
              {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                <div key={i} className="w-2 rounded-t-sm bg-white" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="mt-3 relative z-10">
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-white/70 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${solvedPercentage}%` }}
              />
            </div>
            <p className="text-xs text-white/60 mt-1">completion rate</p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-white/10 text-8xl pointer-events-none select-none">📈</div>
        </div>

        {/* In Progress */}
        <div className="group bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
          <div className="flex items-start justify-between">
            <div className="z-10 relative">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-white/80 mb-2" />
              <p className="text-xs md:text-sm text-white/80 font-medium">In Progress</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{statusCounts['Attempted']}</p>
            </div>
            <div className="flex flex-col gap-1 items-end opacity-40">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`rounded-full bg-white h-2 ${i === 0 ? 'w-8' : i === 1 ? 'w-6' : i === 2 ? 'w-4' : 'w-2'}`} />
              ))}
            </div>
          </div>
          <div className="mt-3 relative z-10">
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-white/70 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${totalProblems > 0 ? (statusCounts['Attempted'] / totalProblems) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-white/60 mt-1">{notAttemptedCount} not started</p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-white/10 text-8xl pointer-events-none select-none">⏳</div>
        </div>
      </div>

      {/* Interactive Donut Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <DonutChart
          data={statusData}
          title="Status Breakdown"
          total={totalProblems}
          centerLabel="total"
          centerValue={totalProblems}
        />
        <DonutChart
          data={difficultyData}
          title="Difficulty Breakdown"
          total={totalProblems}
          centerLabel="problems"
          centerValue={`${solvedPercentage}%`}
        />
      </div>
    </div>
  );
}