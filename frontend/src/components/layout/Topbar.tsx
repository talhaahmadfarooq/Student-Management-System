import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/context/ThemeContext';
import { notifications, messages } from '@/data/dummyData';
import { cn } from '@/utils/cn';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search students, courses, departments..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-1 sm:flex-none">
        {/* Mobile search */}
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 sm:hidden dark:hover:bg-slate-800" aria-label="Search">
          <Search className="h-5 w-5" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Messages */}
        <Dropdown
          width="w-80"
          trigger={
            <div className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
          }
        >
          {(close) => (
            <div>
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Messages</p>
                <Badge variant="primary">2 new</Badge>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {messages.map((m) => (
                  <button
                    key={m.id}
                    onClick={close}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <img src={m.avatar} alt="" className="h-9 w-9 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{m.sender}</p>
                        <span className="text-xs text-slate-400">{m.time}</span>
                      </div>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{m.preview}</p>
                    </div>
                    {m.unread && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Dropdown>

        {/* Notifications */}
        <Dropdown
          width="w-80"
          trigger={
            <div className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
          }
        >
          {(close) => (
            <div>
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                <Badge variant="danger">3 new</Badge>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={close}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
                      !n.read && 'bg-brand-50/50 dark:bg-brand-950/30'
                    )}
                  >
                    <span className={cn(
                      'mt-1.5 h-2 w-2 flex-shrink-0 rounded-full',
                      n.type === 'success' && 'bg-emerald-500',
                      n.type === 'warning' && 'bg-amber-500',
                      n.type === 'info' && 'bg-brand-500'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{n.description}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Dropdown>

        {/* Profile */}
        <Dropdown
          width="w-60"
          trigger={
            <div className="flex items-center gap-2 rounded-lg p-1 pl-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <img
                src="https://i.pravatar.cc/100?img=7"
                alt="Admin"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-tight text-slate-900 dark:text-white">Dr. Admin</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </div>
          }
        >
          {() => (
            <div>
              <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Dr. Admin</p>
                <p className="text-xs text-slate-400">admin@university.edu</p>
              </div>
              <div className="pt-1">
                <DropdownItem icon={<User className="h-4 w-4" />} onClick={() => navigate('/settings')}>
                  My Profile
                </DropdownItem>
                <DropdownItem icon={<SettingsIcon className="h-4 w-4" />} onClick={() => navigate('/settings')}>
                  Settings
                </DropdownItem>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <DropdownItem icon={<LogOut className="h-4 w-4" />} danger onClick={() => navigate('/login')}>
                  Sign out
                </DropdownItem>
              </div>
            </div>
          )}
        </Dropdown>
      </div>
    </header>
  );
}
