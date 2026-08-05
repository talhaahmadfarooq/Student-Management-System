import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const pageTitles: Record<string, { title: string; crumbs: { label: string; href?: string }[] }> = {
  '/dashboard': { title: 'Dashboard', crumbs: [{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }] },
  '/students': { title: 'Students', crumbs: [{ label: 'Home', href: '/dashboard' }, { label: 'Students' }] },
  '/students/add': { title: 'Add Student', crumbs: [{ label: 'Home', href: '/dashboard' }, { label: 'Students', href: '/students' }, { label: 'Add Student' }] },
  '/departments': { title: 'Departments', crumbs: [{ label: 'Home', href: '/dashboard' }, { label: 'Departments' }] },
  '/courses': { title: 'Courses', crumbs: [{ label: 'Home', href: '/dashboard' }, { label: 'Courses' }] },
  '/attendance': { title: 'Attendance', crumbs: [{ label: 'Home', href: '/dashboard' }, { label: 'Attendance' }] },
  '/settings': { title: 'Settings', crumbs: [{ label: 'Home', href: '/dashboard' }, { label: 'Settings' }] },
};

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const path = location.pathname.startsWith('/students/')
    ? location.pathname === '/students/add'
      ? '/students/add'
      : '/students'
    : location.pathname;

  const page = pageTitles[path] || pageTitles['/dashboard'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className={`flex min-h-screen flex-col transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 animate-fade-in">
            <Breadcrumbs items={page.crumbs} />
            <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl">
              {page.title}
            </h1>
          </div>
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
