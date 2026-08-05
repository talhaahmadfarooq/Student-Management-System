import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Pencil,
  Trash2,
  TrendingUp,
  Award,
  Clock,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/context/ToastContext';
import { students, courses as allCourses } from '@/data/dummyData';
import { cn } from '@/utils/cn';

const statusVariant: Record<string, 'success' | 'neutral' | 'danger'> = {
  Active: 'success',
  Inactive: 'neutral',
  Suspended: 'danger',
};

export function StudentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const student = students.find((s) => s.id === Number(id));
  const enrolledCourses = student
    ? allCourses.filter((c) => student.enrolled_courses.includes(c.code))
    : [];

  if (!student) {
    return (
      <Card>
        <EmptyState
          icon={<GraduationCap className="h-8 w-8" />}
          title="Student not found"
          description="The student you're looking for doesn't exist or has been removed."
          action={<Button onClick={() => navigate('/students')}>Back to Students</Button>}
        />
      </Card>
    );
  }

  const infoItems = [
    { icon: Mail, label: 'Email', value: student.email },
    { icon: Phone, label: 'Phone', value: student.phone },
    { icon: MapPin, label: 'Address', value: student.address },
    { icon: Calendar, label: 'Date of Birth', value: new Date(student.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    { icon: Calendar, label: 'Enrolled Since', value: new Date(student.enrollment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
  ];

  const academicItems = [
    { icon: GraduationCap, label: 'Department', value: student.department },
    { icon: BookOpen, label: 'Semester', value: `Semester ${student.semester}` },
    { icon: Award, label: 'GPA', value: student.gpa.toFixed(2) },
    { icon: Clock, label: 'Attendance', value: `${student.attendance}%` },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => toast('info', 'Edit mode', 'Edit form would open here.')}>
            Edit
          </Button>
          <Button variant="danger" size="sm" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Profile header */}
      <Card className="overflow-hidden p-0">
        <div className="h-28 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800" />
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <img
                src={student.avatar}
                alt={student.full_name}
                className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-soft -mt-12 dark:border-slate-900"
              />
              <div className="pb-1 text-center sm:text-left">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{student.full_name}</h2>
                <p className="font-mono text-sm text-slate-400">{student.student_id}</p>
                <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                  <Badge variant={statusVariant[student.status]} dot>{student.status}</Badge>
                  <Badge variant="primary">{student.department}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Award, label: 'GPA', value: student.gpa.toFixed(2), color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
          { icon: Clock, label: 'Attendance', value: `${student.attendance}%`, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/50' },
          { icon: BookOpen, label: 'Courses', value: String(student.enrolled_courses.length), color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
          { icon: TrendingUp, label: 'Semester', value: String(student.semester), color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Contact info */}
        <Card>
          <CardHeader title="Contact Information" icon={<Mail className="h-5 w-5" />} />
          <div className="mt-6 space-y-4">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">{item.label}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Academic info */}
        <Card>
          <CardHeader title="Academic Information" icon={<GraduationCap className="h-5 w-5" />} />
          <div className="mt-6 space-y-4">
            {academicItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">{item.label}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Registered courses */}
      <Card>
        <CardHeader title="Registered Courses" subtitle={`Currently enrolled in ${enrolledCourses.length} courses`} icon={<BookOpen className="h-5 w-5" />} />
        <div className="mt-6 space-y-2">
          {enrolledCourses.length === 0 ? (
            <p className="text-sm text-slate-400">No courses registered.</p>
          ) : (
            enrolledCourses.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{c.title}</p>
                    <p className="text-xs text-slate-400">{c.code} · {c.instructor} · {c.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="info">{c.credits} credits</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          toast('success', 'Student deleted', `${student.full_name} has been removed.`);
          navigate('/students');
        }}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.full_name}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
