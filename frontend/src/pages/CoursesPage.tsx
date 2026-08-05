import { useState } from 'react';
import { BookOpen, Search, Plus, Users, Clock, GraduationCap, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/context/ToastContext';
import { courses, departments } from '@/data/dummyData';

export function CoursesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'all' || c.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by name, code, or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={() => toast('info', 'Export started', 'Generating course list.')}>
              Export
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => toast('info', 'Add Course', 'Form would open here.')}>
              Add Course
            </Button>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookOpen className="h-8 w-8" />}
            title="No courses found"
            description="Try adjusting your search or filters, or add a new course."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} hover className="animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <Badge variant="info">{c.credits} Credits</Badge>
              </div>
              <div className="mt-4">
                <p className="font-mono text-xs font-medium text-slate-400">{c.code}</p>
                <h3 className="mt-0.5 font-display text-base font-bold text-slate-900 dark:text-white">{c.title}</h3>
              </div>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <GraduationCap className="h-4 w-4" />
                  <span>{c.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Users className="h-4 w-4" />
                  <span>{c.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span>{c.schedule}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-xs font-medium text-slate-400">Enrolled Students</span>
                <span className="font-display text-lg font-bold text-slate-900 dark:text-white">{c.enrolled_students}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
