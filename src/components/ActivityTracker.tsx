'use client';

import { useMemo } from 'react';
import type { Problem } from '@/types';
import { Calendar, Flame, TrendingUp, Star, Zap } from 'lucide-react';

interface ActivityTrackerProps {
  problems: Problem[];
}

export default function ActivityTracker({ problems }: ActivityTrackerProps) {
  // Calculate activity data
  const activityData = useMemo(() => {
    const activityMap = new Map<string, number>();
    
    problems.forEach(problem => {
      if (problem.lastAttemptedAt) {
        const dateStr = problem.lastAttemptedAt.toISOString().split('T')[0];
        activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
      }
    });

    return activityMap;
  }, [problems]);

  // Calculate current streak
  const currentStreak = useMemo(() => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (activityData.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [activityData]);

  // Calculate longest streak
  const longestStreak = useMemo(() => {
    if (activityData.size === 0) return 0;

    const sortedDates = Array.from(activityData.keys()).sort();
    let maxStreak = 1;
    let currentStreakCount = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreakCount++;
        maxStreak = Math.max(maxStreak, currentStreakCount);
      } else {
        currentStreakCount = 1;
      }
    }

    return maxStreak;
  }, [activityData]);

  // Find best day (most problems in one day)
  const bestDay = useMemo(() => {
    if (activityData.size === 0) return { date: null, count: 0 };
    
    let maxCount = 0;
    let bestDate = '';

    activityData.forEach((count, date) => {
      if (count > maxCount) {
        maxCount = count;
        bestDate = date;
      }
    });

    return { date: bestDate, count: maxCount };
  }, [activityData]);

  // Generate calendar grid (last 12 weeks)
  const calendarData = useMemo(() => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 83); // 12 weeks = 84 days

    for (let week = 0; week < 12; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = activityData.get(dateStr) || 0;
        
        weekDays.push({
          date: currentDate,
          dateStr,
          count,
          isFuture: currentDate > today,
        });
      }
      weeks.push(weekDays);
    }

    return weeks;
  }, [activityData]);

  // Get color intensity based on activity count
  const getIntensityColor = (count: number, isFuture: boolean) => {
    if (isFuture) return 'bg-gray-100 dark:bg-gray-800';
    if (count === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (count === 1) return 'bg-green-300 dark:bg-green-800';
    if (count === 2) return 'bg-green-400 dark:bg-green-700';
    if (count >= 3) return 'bg-green-500 dark:bg-green-600';
    return 'bg-gray-200 dark:bg-gray-700';
  };

  const totalActiveDays = activityData.size;

  // Get motivational message
  const getMotivationalMessage = () => {
    if (currentStreak >= 7) return "🔥 You're on fire! Keep it going!";
    if (currentStreak >= 3) return "💪 Great momentum! Don't break the chain!";
    if (totalActiveDays >= 10) return "⭐ Consistency is key! You're doing great!";
    if (totalActiveDays > 0) return "🚀 Every problem solved is progress!";
    return "🎯 Start your journey today!";
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 md:p-8 rounded-2xl shadow-xl mb-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent pb-1">
          Activity Tracker
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Current Streak Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 md:p-6 rounded-xl shadow-lg overflow-hidden relative">
          <div className="flex items-start justify-between">
            <div className="z-10 relative">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <p className="text-xs md:text-sm text-white/80 font-medium">Current Streak</p>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white">{currentStreak}</p>
              <p className="text-xs md:text-sm text-white/80 mt-1">days in a row</p>
            </div>
            {/* Decorative Right Side - streak bars */}
            <div className="flex flex-col items-end gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded-full transition-all ${
                    i < currentStreak % 7 || currentStreak >= 7
                      ? 'bg-white/60 w-8'
                      : 'bg-white/20 w-4'
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Background decorative flame */}
          <div className="absolute -bottom-4 -right-4 text-white/10 text-9xl pointer-events-none select-none">
            🔥
          </div>
        </div>

        {/* Longest Streak Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 md:p-6 rounded-xl shadow-lg overflow-hidden relative">
          <div className="flex items-start justify-between">
            <div className="z-10 relative">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <p className="text-xs md:text-sm text-white/80 font-medium">Longest Streak</p>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white">{longestStreak}</p>
              <p className="text-xs md:text-sm text-white/80 mt-1">personal best</p>
            </div>
            {/* Decorative bar chart */}
            <div className="flex items-end gap-1 h-16">
              {[30, 55, 40, 70, 50, 85, 65].map((height, i) => (
                <div
                  key={i}
                  className="w-3 rounded-t-sm bg-white/30 hover:bg-white/50 transition-all"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          {/* Background decorative */}
          <div className="absolute -bottom-4 -right-4 text-white/10 text-9xl pointer-events-none select-none">
            ⚡
          </div>
        </div>

        {/* Active Days Card */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 md:p-6 rounded-xl shadow-lg overflow-hidden relative">
          <div className="flex items-start justify-between">
            <div className="z-10 relative">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <p className="text-xs md:text-sm text-white/80 font-medium">Active Days</p>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white">{totalActiveDays}</p>
              <p className="text-xs md:text-sm text-white/80 mt-1">days practiced</p>
            </div>
            {/* Decorative mini calendar dots */}
            <div className="grid grid-cols-4 gap-1">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm ${
                    i < totalActiveDays % 16
                      ? 'bg-white/70'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Background decorative */}
          <div className="absolute -bottom-4 -right-4 text-white/10 text-9xl pointer-events-none select-none">
            📅
          </div>
        </div>
      </div>

      {/* Activity Calendar and Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar - Takes 2 columns on desktop, full width on mobile */}
        <div className="md:col-span-2 bg-gray-50/50 dark:bg-gray-900/50 p-4 md:p-6 rounded-xl overflow-x-auto">
          <h3 className="text-base md:text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Last 12 Weeks</h3>
          
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex gap-1 md:gap-2 mb-2 md:mb-3 ml-10 md:ml-16">
              {(() => {
                const months = [];
                const today = new Date();
                const startDate = new Date(today);
                startDate.setDate(today.getDate() - 83);
                
                let currentMonth = '';
                let monthStartWeek = 0;
                
                for (let week = 0; week < 12; week++) {
                  const weekDate = new Date(startDate);
                  weekDate.setDate(startDate.getDate() + (week * 7));
                  const monthName = weekDate.toLocaleDateString('en-US', { month: 'short' });
                  
                  if (monthName !== currentMonth) {
                    if (currentMonth !== '') {
                      months.push({
                        name: currentMonth,
                        startWeek: monthStartWeek,
                        weekCount: week - monthStartWeek
                      });
                    }
                    currentMonth = monthName;
                    monthStartWeek = week;
                  }
                }
                
                // Add the last month
                if (currentMonth !== '') {
                  months.push({
                    name: currentMonth,
                    startWeek: monthStartWeek,
                    weekCount: 12 - monthStartWeek
                  });
                }
                
                return months.map((month, index) => (
                  <div 
                    key={index}
                    className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-semibold"
                    style={{ width: `${month.weekCount * 20}px` }}
                  >
                    {month.name}
                  </div>
                ));
              })()}
            </div>

            {/* Day labels and calendar */}
            <div className="flex gap-1 md:gap-3">
              <div className="w-10 md:w-16 flex flex-col gap-1 md:gap-2 justify-around text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                <div>Mon</div>
                <div>Wed</div>
                <div>Fri</div>
              </div>
              <div className="flex gap-1 md:gap-2">
                {calendarData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1 md:gap-2">
                    {week.map((day, dayIndex) => {
                      const isToday = day.dateStr === new Date().toISOString().split('T')[0];
                      return (
                        <div
                          key={dayIndex}
                          className={`w-4 h-4 md:w-6 md:h-6 rounded ${getIntensityColor(day.count, day.isFuture)} 
                            ${isToday ? 'ring-1 md:ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                            transition-all hover:scale-110 cursor-pointer`}
                          title={`${day.date.toLocaleDateString()}: ${day.count} problem${day.count !== 1 ? 's' : ''}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mt-3 md:mt-5 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <span>Less</span>
              <div className="flex gap-1 md:gap-2">
                <div className="w-3 h-3 md:w-5 md:h-5 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="w-3 h-3 md:w-5 md:h-5 rounded bg-green-300 dark:bg-green-800"></div>
                <div className="w-3 h-3 md:w-5 md:h-5 rounded bg-green-400 dark:bg-green-700"></div>
                <div className="w-3 h-3 md:w-5 md:h-5 rounded bg-green-500 dark:bg-green-600"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Additional Stats - Grid layout on mobile, single column on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
          {/* Best Day */}
          <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-4 md:p-5 rounded-xl shadow-lg overflow-hidden relative">
            <div className="flex items-start justify-between">
              <div className="z-10 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  <p className="text-xs md:text-sm text-white/90 font-semibold">Best Day</p>
                </div>
                {bestDay.date ? (
                  <>
                    <p className="text-2xl md:text-3xl font-bold text-white">{bestDay.count}</p>
                    <p className="text-xs text-white/80 mt-1">
                      {new Date(bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </>
                ) : (
                  <p className="text-xs md:text-sm text-white/80">No activity yet</p>
                )}
              </div>
              <div className="text-4xl opacity-20 select-none">⭐</div>
            </div>
            <div className="absolute -bottom-4 -right-4 text-white/10 text-9xl pointer-events-none select-none">
              🏆
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 md:p-5 rounded-xl shadow-lg overflow-hidden relative">
            <div className="flex items-start justify-between">
              <div className="z-10 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  <p className="text-xs md:text-sm text-white/90 font-semibold">Keep Going!</p>
                </div>
                <p className="text-xs md:text-sm text-white font-medium leading-relaxed">
                  {getMotivationalMessage()}
                </p>
              </div>
              <div className="text-4xl opacity-20 select-none">💪</div>
            </div>
            <div className="absolute -bottom-4 -right-4 text-white/10 text-9xl pointer-events-none select-none">
              🚀
            </div>
          </div>

          {/* This Week Progress */}
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 sm:col-span-2 md:col-span-1 overflow-hidden relative">
            <div className="flex items-start justify-between">
              <div className="z-10 relative">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-semibold">This Week</p>
                </div>
                {(() => {
                  const today = new Date();
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - today.getDay());
                  
                  let weekCount = 0;
                  for (let i = 0; i < 7; i++) {
                    const day = new Date(startOfWeek);
                    day.setDate(startOfWeek.getDate() + i);
                    const dateStr = day.toISOString().split('T')[0];
                    weekCount += activityData.get(dateStr) || 0;
                  }
                  
                  return (
                    <>
                      <p className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{weekCount}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">problems attempted</p>
                    </>
                  );
                })()}
              </div>
              {/* Decorative week day dots */}
              <div className="flex flex-col gap-1 items-end">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                  const today = new Date();
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - today.getDay());
                  const thisDay = new Date(startOfWeek);
                  thisDay.setDate(startOfWeek.getDate() + i);
                  const dateStr = thisDay.toISOString().split('T')[0];
                  const hasActivity = (activityData.get(dateStr) || 0) > 0;
                  const isPast = thisDay <= today;

                  return (
                    <div key={i} className="flex items-center gap-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500 w-3">{day}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        hasActivity
                          ? 'bg-indigo-500'
                          : isPast
                          ? 'bg-gray-200 dark:bg-gray-600'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}