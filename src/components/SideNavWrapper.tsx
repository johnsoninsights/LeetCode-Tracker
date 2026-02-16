'use client';

import { useAuth } from '@/context/AuthContext';
import SideNav from './SideNav';

export default function SideNavWrapper() {
  const { user, loading } = useAuth();

  // Only show nav when user is logged in
  if (loading || !user) return null;

  return <SideNav />;
}