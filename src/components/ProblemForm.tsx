'use client';

import { useState } from 'react';
import type { Difficulty, AlgorithmTag, Status, Problem } from '@/types';
import { Plus, Code2 } from 'lucide-react';

interface ProblemFormProps {
  onAddProblem: (problem: Problem) => void;
}

export default function ProblemForm({ onAddProblem }: ProblemFormProps) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [selectedTags, setSelectedTags] = useState<AlgorithmTag[]>([]);
  const [leetcodeNumber, setLeetcodeNumber] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProblem: Problem = {
      id: Date.now().toString(),
      title,
      difficulty,
      tags: selectedTags,
      leetcodeNumber: leetcodeNumber ? parseInt(leetcodeNumber) : undefined,
      url: url || undefined,
      status: 'Not Attempted' as Status,
      createdAt: new Date(),
    };

    onAddProblem(newProblem);
    
    setTitle('');
    setLeetcodeNumber('');
    setUrl('');
    setSelectedTags([]);
  };

  const allTags: AlgorithmTag[] = [
    'Arrays', 'Strings', 'Two Pointers', 'Sliding Window',
    'Hash Maps', 'Linked Lists', 'Trees', 'Graphs',
    'Dynamic Programming', 'Backtracking', 'Binary Search',
    'Sorting', 'Other'
  ];

  const toggleTag = (tag: AlgorithmTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-3 mb-6">
        <Code2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Problem</h2>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Problem Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          placeholder="e.g., Two Sum"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">LeetCode # (optional)</label>
          <input
            type="number"
            value={leetcodeNumber}
            onChange={(e) => setLeetcodeNumber(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Problem URL (optional)</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">Algorithm Tags</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        Add Problem
      </button>
    </form>
  );
}