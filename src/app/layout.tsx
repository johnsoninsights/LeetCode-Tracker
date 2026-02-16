import type { Metadata } from 'next';
import { Providers } from './providers';
import SideNav from '@/components/SideNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'LeetCode Progress Tracker',
  description: 'Track your LeetCode journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SideNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}