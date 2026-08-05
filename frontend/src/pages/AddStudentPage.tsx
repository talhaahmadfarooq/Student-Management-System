import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User, ArrowLeft, Save, X } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { departments } from '@/data/dummyData';

interface FormData {
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  gender: string;
  date_of_birth: string;
  address: string;
}

const emptyForm: FormData = {
  student_id: '',
  full_name: '',
  email: '',
  phone: '',
  department: '',
  semester: '1',
  gender: '',
  date_of_birth: '',
  address: '',
};

export function AddStudentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.student_id.trim()) e.student_id = 'Student ID is required';
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.department) e.department = 'Please select a department';
    if (!form.gender) e.gender = 'Please select a gender';
    if (!form.date_of_birth) e.date_of_birth = 'Date of birth is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast('error', 'Validation error', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    // Frontend-only: this will POST to /students in the Flask backend.
    setTimeout(() => {
      setLoading(false);
      toast('success', 'Student added', `${form.full_name} has been enrolled successfully.`);
      navigate('/students');
    }, 900);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile picture upload */}
        <Card>
          <CardHeader title="Profile Picture" subtitle="Upload a photo for the student" icon={<User className="h-5 w-5" />} />
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                )}
              </div>
              {preview && (
                <button
                  type="button"
                  onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              <Button type="button" variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />} onClick={() => fileRef.current?.click()}>
                Upload Photo
              </Button>
              <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </Card>

        {/* Basic info */}
        <Card>
          <CardHeader title="Basic Information" subtitle="Student identification and personal details" icon={<User className="h-5 w-5" />} />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Student ID"
              name="student_id"
              placeholder="STU-2024-016"
              value={form.student_id}
              onChange={(e) => handleChange('student_id', e.target.value)}
              error={errors.student_id}
              required
            />
            <Input
              label="Full Name"
              name="full_name"
              placeholder="John Doe"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              error={errors.full_name}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="john.doe@university.edu"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              placeholder="+1 (415) 555-0100"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              required
            />
            <Select
              label="Department"
              name="department"
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
              error={errors.department}
              required
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </Select>
            <Select
              label="Semester"
              name="semester"
              value={form.semester}
              onChange={(e) => handleChange('semester', e.target.value)}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>Semester {i + 1}</option>
              ))}
            </Select>
            <Select
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              error={errors.gender}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
            <Input
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              error={errors.date_of_birth}
              required
            />
          </div>
          <div className="mt-5">
            <Textarea
              label="Address"
              name="address"
              rows={3}
              placeholder="123 Main Street, San Francisco, CA 94101"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/students')}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} leftIcon={!loading ? <Save className="h-4 w-4" /> : undefined}>
            Save Student
          </Button>
        </div>
      </form>
    </div>
  );
}
