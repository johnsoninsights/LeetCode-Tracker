'use client';

import { useState } from 'react';
import type { Difficulty, AlgorithmTag, Status, Problem } from '@/types';

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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Add New Problem</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-900">Problem Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border-2 border-gray-300 rounded text-gray-900 focus:border-blue-500 focus:outline-none"
          placeholder="e.g., Two Sum"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-900">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="w-full p-2 border-2 border-gray-300 rounded text-gray-900 focus:border-blue-500 focus:outline-none"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-900">LeetCode Number (optional)</label>
        <input
          type="number"
          value={leetcodeNumber}
          onChange={(e) => setLeetcodeNumber(e.target.value)}
          className="w-full p-2 border-2 border-gray-300 rounded text-gray-900 focus:border-blue-500 focus:outline-none"
          placeholder="e.g., 1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-900">Problem URL (optional)</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border-2 border-gray-300 rounded text-gray-900 focus:border-blue-500 focus:outline-none"
          placeholder="https://leetcode.com/problems/..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-900">Algorithm Tags</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
      >
        Add Problem
      </button>
    </form>
  );
}