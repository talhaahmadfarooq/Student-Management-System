import { useState } from 'react';
import { CalendarCheck, Search, Check, X, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { students, courses } from '@/data/dummyData';
import { cn } from '@/utils/cn';

type Status = 'present' | 'absent' | 'late';

const statusConfig: Record<Status, { label: string; variant: 'success' | 'danger' | 'warning'; icon: typeof Check }> = {
  present: { label: 'Present', variant: 'success', icon: Check },
  absent: { label: 'Absent', variant: 'danger', icon: X },
  late: { label: 'Late', variant: 'warning', icon: Clock },
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const currentDay = new Date().getDay() || 5;

export function AttendancePage() {
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courses[0].code);
  const [selectedDay, setSelectedDay] = useState(weekDays[Math.min(currentDay - 1, 4)]);
  const [attendance, setAttendance] = useState<Record<string, Status>>(() => {
    const map: Record<string, Status> = {};
    students.slice(0, 10).forEach((s, i) => {
      map[s.id] = i % 7 === 0 ? 'absent' : i % 5 === 0 ? 'late' : 'present';
    });
    return map;
  });

  const filtered = students.slice(0, 10).filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) || s.student_id.toLowerCase().includes(search.toLowerCase())
  );

  const setStatus = (studentId: number, status: Status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;
  const lateCount = Object.values(attendance).filter((s) => s === 'late').length;
  const rate = Math.round((presentCount / students.slice(0, 10).length) * 100);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Attendance Rate', value: `${rate}%`, icon: CalendarCheck, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/50' },
          { label: 'Present', value: String(presentCount), icon: Check, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
          { label: 'Absent', value: String(absentCount), icon: X, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
          { label: 'Late', value: String(lateCount), icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', s.color)}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Calendar widget */}
      <Card>
        <CardHeader title="Attendance Calendar" subtitle="Select a day to mark attendance" icon={<CalendarCheck className="h-5 w-5" />} />
        <div className="mt-6 flex items-center justify-between gap-2">
          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 justify-center gap-2">
            {weekDays.map((day, i) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all',
                  selectedDay === day
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <span className="text-xs font-medium">{day}</span>
                <span className="font-display text-lg font-bold">{15 + i}</span>
              </button>
            ))}
          </div>
          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Card>

      {/* Attendance table */}
      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.code}>{c.code} — {c.title}</option>
              ))}
            </select>
          </div>
          <Button size="sm" leftIcon={<Check className="h-4 w-4" />}>Save Attendance</Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck className="h-8 w-8" />}
            title="No students found"
            description="Try adjusting your search."
          />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Student</th>
                  <th className="hidden px-6 py-3.5 font-semibold text-slate-600 sm:table-cell dark:text-slate-300">Student ID</th>
                  <th className="px-6 py-3.5 text-center font-semibold text-slate-600 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((s) => {
                  const status = attendance[s.id] || 'present';
                  return (
                    <tr key={s.id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={s.avatar} alt={s.full_name} className="h-9 w-9 rounded-full object-cover" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{s.full_name}</p>
                            <p className="text-xs text-slate-400 sm:hidden">{s.student_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 font-mono text-xs text-slate-500 sm:table-cell dark:text-slate-400">{s.student_id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {(['present', 'late', 'absent'] as Status[]).map((st) => {
                            const conf = statusConfig[st];
                            const isActive = status === st;
                            return (
                              <button
                                key={st}
                                onClick={() => setStatus(s.id, st)}
                                className={cn(
                                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                                  isActive
                                    ? conf.variant === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                      : conf.variant === 'danger' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                )}
                              >
                                <conf.icon className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">{conf.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
