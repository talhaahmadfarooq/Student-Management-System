import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Save, Moon, Sun } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

type Tab = 'profile' | 'notifications' | 'security' | 'appearance';

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState({ full_name: 'Dr. Admin', email: 'admin@university.edu', phone: '+1 (415) 555-0100', role: 'Administrator', language: 'English' });
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false, weekly: true, enrollment: true, attendance: true });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
              tab === t.id
                ? 'bg-brand-600 text-white shadow-soft'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <Card className="animate-fade-in">
          <CardHeader title="Profile Information" subtitle="Update your personal details" icon={<User className="h-5 w-5" />} />
          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/150?img=7" alt="Profile" className="h-16 w-16 rounded-2xl object-cover" />
              <Button variant="outline" size="sm">Change Photo</Button>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Full Name" name="full_name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
              <Input label="Email Address" name="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <Input label="Phone Number" name="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              <Input label="Role" name="role" value={profile.role} disabled />
              <Select label="Language" name="language" value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => toast('success', 'Profile saved', 'Your changes have been saved.')}>
              Save Changes
            </Button>
          </div>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card className="animate-fade-in">
          <CardHeader title="Notification Preferences" subtitle="Choose what you want to be notified about" icon={<Bell className="h-5 w-5" />} />
          <div className="mt-6 space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Receive text message alerts' },
              { key: 'weekly', label: 'Weekly Summary', desc: 'Get a weekly digest of activities' },
              { key: 'enrollment', label: 'New Enrollments', desc: 'Notify when a student enrolls' },
              { key: 'attendance', label: 'Attendance Alerts', desc: 'Notify on low attendance warnings' },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{n.label}</p>
                  <p className="text-xs text-slate-400">{n.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key as keyof typeof notifications] })}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                    notifications[n.key as keyof typeof notifications] ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                    notifications[n.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => toast('success', 'Preferences saved', 'Notification settings updated.')}>
              Save Preferences
            </Button>
          </div>
        </Card>
      )}

      {tab === 'security' && (
        <Card className="animate-fade-in">
          <CardHeader title="Security Settings" subtitle="Manage your password and security" icon={<Shield className="h-5 w-5" />} />
          <div className="mt-6 space-y-5">
            <Input label="Current Password" name="current_password" type="password" placeholder="••••••••" />
            <Input label="New Password" name="new_password" type="password" placeholder="••••••••" />
            <Input label="Confirm New Password" name="confirm_password" type="password" placeholder="••••••••" />
            <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
                </div>
                <Badge variant="warning">Disabled</Badge>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => toast('success', 'Security updated', 'Your security settings have been saved.')}>
              Update Security
            </Button>
          </div>
        </Card>
      )}

      {tab === 'appearance' && (
        <Card className="animate-fade-in">
          <CardHeader title="Appearance" subtitle="Customize how the portal looks" icon={<Palette className="h-5 w-5" />} />
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Theme</p>
              <p className="text-xs text-slate-400">Choose between light and dark mode</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 p-4 transition-all',
                    theme === 'light' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-700'
                  )}
                >
                  <Sun className="h-5 w-5 text-amber-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Light</p>
                    <p className="text-xs text-slate-400">Bright and clean</p>
                  </div>
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 p-4 transition-all',
                    theme === 'dark' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-700'
                  )}
                >
                  <Moon className="h-5 w-5 text-brand-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Dark</p>
                    <p className="text-xs text-slate-400">Easy on the eyes</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Timezone</p>
                  <p className="text-xs text-slate-400">Pacific Time (UTC-08:00)</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
