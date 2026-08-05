import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Building2,
  BookOpen,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  UserPlus,
  FileText,
  CalendarPlus,
  GraduationCap,
  CreditCard,
  ClipboardCheck,
  PencilLine,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { stats, studentGrowth, activities, departmentDistribution } from '@/data/dummyData';

const statCards = [
  { key: 'totalStudents', label: 'Total Students', icon: Users, value: stats.totalStudents, change: '+12.5%', trend: 'up', color: 'from-brand-500 to-brand-700', bg: 'bg-brand-50 dark:bg-brand-950/50', iconColor: 'text-brand-600 dark:text-brand-400' },
  { key: 'activeStudents', label: 'Active Students', icon: UserCheck, value: stats.activeStudents, change: '+8.2%', trend: 'up', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-950/50', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'departments', label: 'Departments', icon: Building2, value: stats.departments, change: '+1', trend: 'up', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/50', iconColor: 'text-amber-600 dark:text-amber-400' },
  { key: 'courses', label: 'Courses', icon: BookOpen, value: stats.courses, change: '-2', trend: 'down', color: 'from-rose-500 to-red-600', bg: 'bg-rose-50 dark:bg-rose-950/50', iconColor: 'text-rose-600 dark:text-rose-400' },
];

const activityIcons = {
  enrollment: { icon: UserPlus, color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/50' },
  grade: { icon: GraduationCap, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
  attendance: { icon: ClipboardCheck, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
  payment: { icon: CreditCard, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50' },
  profile: { icon: PencilLine, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
};

const quickActions = [
  { label: 'Add Student', icon: UserPlus, to: '/students/add' },
  { label: 'View Courses', icon: BookOpen, to: '/courses' },
  { label: 'Take Attendance', icon: CalendarPlus, to: '/attendance' },
  { label: 'Generate Report', icon: FileText, to: '/students' },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-8 text-white">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-20 h-32 w-32 rounded-full bg-accent-500/20 blur-2xl" />
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-white/70">Good morning, Dr. Admin</p>
            <h2 className="mt-1 font-display text-2xl font-bold lg:text-3xl">Welcome back to EduSphere</h2>
            <p className="mt-2 max-w-lg text-white/80">
              Here's what's happening across your university today. You have 3 pending approvals and 12 new enrollments this week.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="border-0 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={() => navigate('/students/add')}
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.key} hover className="animate-fade-in">
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.iconColor}`} />
              </div>
              <Badge variant={s.trend === 'up' ? 'success' : 'danger'} dot>
                {s.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.change}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">
                <AnimatedCounter value={s.value} />
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Student Growth"
            subtitle="Monthly enrollment trends over the past year"
            icon={<TrendingUp className="h-5 w-5" />}
            action={
              <div className="flex gap-2">
                <Badge variant="primary">+50.8% YoY</Badge>
              </div>
            }
          />
          <div className="mt-6 text-slate-400 dark:text-slate-500">
            <AreaChart data={studentGrowth} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Department Distribution"
            subtitle="Students by department"
            icon={<Building2 className="h-5 w-5" />}
          />
          <div className="mt-8 text-slate-900 dark:text-white">
            <DonutChart data={departmentDistribution} />
          </div>
        </Card>
      </div>

      {/* Activity + Quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Activity"
            subtitle="Latest events across the university"
            icon={<ClipboardCheck className="h-5 w-5" />}
            action={
              <button className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400">
                View all
              </button>
            }
          />
          <div className="mt-6 space-y-1">
            {activities.map((act) => {
              const conf = activityIcons[act.type];
              return (
                <div key={act.id} className="flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${conf.color}`}>
                    <conf.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{act.message}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      by {act.actor} · {act.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Quick Actions" subtitle="Common administrative tasks" icon={<ArrowUpRight className="h-5 w-5" />} />
          <div className="mt-6 grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:shadow-soft dark:border-slate-700 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950/50 dark:text-brand-400">
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
