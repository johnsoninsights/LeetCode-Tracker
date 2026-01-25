'use client';

import { useAuth } from '@/context/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed top-4 left-4 flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700">
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {user.email}
      </span>
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}