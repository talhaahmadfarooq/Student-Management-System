import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Frontend-only: simulate navigation. Real auth will go through POST /register.
    setTimeout(() => {
      setLoading(false);
      toast('success', 'Account created!', 'Your administrator account is ready.');
      navigate('/login');
    }, 900);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Illustration */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">EduSphere</h1>
              <p className="text-sm text-white/70">University Management System</p>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="font-display text-4xl font-bold leading-tight">
              Join the future of university administration.
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Create your account to access powerful tools for managing students, faculty, courses, and academic records.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Comprehensive student lifecycle management',
                'Department & course administration',
                'Attendance tracking & academic reporting',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/60">
            <span>© 2026 EduSphere University</span>
            <span>Trusted by 500+ institutions</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">EduSphere</h1>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Register as a university administrator to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="full_name"
              placeholder="Dr. Jane Smith"
              leftIcon={<User className="h-4 w-4" />}
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              error={errors.full_name}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@university.edu"
              leftIcon={<Mail className="h-4 w-4" />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />

            <div>
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
              />
            </div>

            <div>
              <Input
                label="Confirm Password"
                name="confirm_password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                error={errors.confirm_password}
              />
            </div>

            <p className="text-xs text-slate-400">
              By creating an account, you agree to EduSphere's Terms of Service and Privacy Policy.
            </p>

            <Button type="submit" size="lg" loading={loading} className="w-full" rightIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}>
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
