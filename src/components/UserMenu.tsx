'use client';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function UserMenu() {
  const { user, logout, isDemo } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
    } catch (error) {
      console.error('Logout failed:', error);
      showToast('Logout failed', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDemo ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[150px] truncate hidden sm:inline">
          {isDemo ? 'Demo Mode' : user.email}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isDemo ? 'Browsing as' : 'Signed in as'}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {isDemo ? '👀 Demo User' : user.email}
              </p>
            </div>
            {isDemo && (
              <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-700 dark:text-yellow-400">Changes won't be saved in demo mode</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {isDemo ? 'Exit Demo' : 'Sign out'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}