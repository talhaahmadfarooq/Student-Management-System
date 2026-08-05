import { useState } from 'react';
import { Building2, Users, BookOpen, Search, Plus, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/context/ToastContext';
import { departments, courses } from '@/data/dummyData';
import { cn } from '@/utils/cn';

export function DepartmentsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const filtered = departments.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => toast('info', 'Add Department', 'Form would open here.')}>
            Add Department
          </Button>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Building2 className="h-8 w-8" />}
            title="No departments found"
            description="Try adjusting your search or add a new department."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => {
            const courseCount = courses.filter((c) => c.department === d.name).length;
            return (
              <Card key={d.id} hover className="animate-fade-in">
                <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft', d.color)}>
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{d.name}</h3>
                    <Badge variant="primary">{d.code}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{d.description}</p>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-400">Department Head</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{d.head}</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                    <Users className="mx-auto h-4 w-4 text-brand-500" />
                    <p className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">{d.student_count}</p>
                    <p className="text-xs text-slate-400">Students</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                    <GraduationCap className="mx-auto h-4 w-4 text-emerald-500" />
                    <p className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">{d.faculty_count}</p>
                    <p className="text-xs text-slate-400">Faculty</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                    <BookOpen className="mx-auto h-4 w-4 text-amber-500" />
                    <p className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">{courseCount}</p>
                    <p className="text-xs text-slate-400">Courses</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
