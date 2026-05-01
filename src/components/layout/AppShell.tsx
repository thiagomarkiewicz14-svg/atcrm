import { Outlet } from 'react-router-dom';

import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="min-h-screen md:pl-72">
        <TopBar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-10 lg:px-8">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
