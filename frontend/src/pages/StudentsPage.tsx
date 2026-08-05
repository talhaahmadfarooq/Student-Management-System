import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Search,
  UserPlus,
  Download,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  Users,
  ChevronDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { useToast } from '@/context/ToastContext';
import { students as allStudents, departments } from '@/data/dummyData';
import type { Student } from '@/types';
import { cn } from '@/utils/cn';
import axios from "axios";

type SortKey = 'student_id' | 'full_name' | 'department' | 'semester' | 'gpa';
type SortDir = 'asc' | 'desc';

const statusVariant: Record<string, 'success' | 'neutral' | 'danger'> = {
  Active: 'success',
  Inactive: 'neutral',
  Suspended: 'danger',
};

const pageSize = 8;

export function StudentsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('student_id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
  axios
    .get("http://127.0.0.1:5000/students")
    .then((response) => {
      setStudents(response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching students:", error);
    });
}, []);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = students.filter((s) => {
      const matchesSearch =
        s.full_name.toLowerCase().includes(search.toLowerCase()) ||
        s.student_id.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === 'all' || s.department === deptFilter;
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'gpa' || sortKey === 'semester') {
        cmp = (a[sortKey] as number) - (b[sortKey] as number);
      } else {
        cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [students, search, deptFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-brand-600" /> : <ArrowDown className="h-3.5 w-3.5 text-brand-600" />;
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    toast('success', 'Student deleted', `${deleteTarget.full_name} has been removed.`);
  };

  const handleExport = () => {
    toast('info', 'Export started', 'Your CSV file is being generated.');
  };

  const resetFilters = () => {
    setSearch('');
    setDeptFilter('all');
    setStatusFilter('all');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" leftIcon={<Filter className="h-4 w-4" />} onClick={() => setShowFilters(!showFilters)}>
              Filters
              <ChevronDown className={cn('ml-1 h-4 w-4 transition-transform', showFilters && 'rotate-180')} />
            </Button>
            <Button variant="outline" size="md" leftIcon={<Download className="h-4 w-4" />} onClick={handleExport}>
              Export
            </Button>
            <Button size="md" leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => navigate('/students/add')}>
              Add Student
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row dark:border-slate-800">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Department</label>
              <select
                value={deptFilter}
                onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={resetFilters} className="h-10 rounded-xl px-4 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                Reset
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        {paginated.length === 0 ? (
          <EmptyState
            icon={<Users className="h-8 w-8" />}
            title="No students found"
            description="Try adjusting your search or filters, or add a new student to get started."
            action={<Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => navigate('/students/add')}>Add Student</Button>}
          />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">
                    <button onClick={() => handleSort('student_id')} className="flex items-center gap-1.5 hover:text-brand-600">
                      Student ID <SortIcon col="student_id" />
                    </button>
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">
                    <button onClick={() => handleSort('full_name')} className="flex items-center gap-1.5 hover:text-brand-600">
                      Student <SortIcon col="full_name" />
                    </button>
                  </th>
                  <th className="hidden px-6 py-3.5 font-semibold text-slate-600 md:table-cell dark:text-slate-300">
                    <button onClick={() => handleSort('department')} className="flex items-center gap-1.5 hover:text-brand-600">
                      Department <SortIcon col="department" />
                    </button>
                  </th>
                  <th className="hidden px-6 py-3.5 font-semibold text-slate-600 lg:table-cell dark:text-slate-300">
                    <button onClick={() => handleSort('semester')} className="flex items-center gap-1.5 hover:text-brand-600">
                      Semester <SortIcon col="semester" />
                    </button>
                  </th>
                  <th className="hidden px-6 py-3.5 font-semibold text-slate-600 lg:table-cell dark:text-slate-300">
                    <button onClick={() => handleSort('gpa')} className="flex items-center gap-1.5 hover:text-brand-600">
                      GPA <SortIcon col="gpa" />
                    </button>
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="px-6 py-3.5 text-right font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginated.map((s) => (
                  <tr key={s.id} className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">{s.student_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => navigate(`/students/${s.id}`)} className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.full_name} className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                        <div className="text-left">
                          <p className="font-medium text-slate-900 group-hover:text-brand-600 dark:text-white">{s.full_name}</p>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </button>
                    </td>
                    <td className="hidden px-6 py-4 text-slate-600 md:table-cell dark:text-slate-300">{s.department}</td>
                    <td className="hidden px-6 py-4 text-slate-600 lg:table-cell dark:text-slate-300">Semester {s.semester}</td>
                    <td className="hidden px-6 py-4 lg:table-cell">
                      <span className={cn(
                        'inline-flex items-center rounded-lg px-2 py-0.5 text-sm font-semibold',
                        s.gpa >= 3.7 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : s.gpa >= 3.0 ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                      )}>
                        {s.gpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[s.status]} dot>{s.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/students/${s.id}`)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/50"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/students/${s.id}`)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/50"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {paginated.length > 0 && (
        <div className="px-1">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={pageSize}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteTarget?.full_name}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
