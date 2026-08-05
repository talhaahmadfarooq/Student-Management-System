export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: number;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  gender: Gender;
  date_of_birth: string;
  address: string;
  avatar: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  gpa: number;
  attendance: number;
  enrolled_courses: string[];
  enrollment_date: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  head: string;
  faculty_count: number;
  student_count: number;
  description: string;
  color: string;
}

export interface Course {
  id: number;
  code: string;
  title: string;
  department: string;
  credits: number;
  instructor: string;
  enrolled_students: number;
  semester: number;
  schedule: string;
}

export interface Activity {
  id: number;
  type: 'enrollment' | 'grade' | 'attendance' | 'payment' | 'profile';
  message: string;
  actor: string;
  timestamp: string;
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface Message {
  id: number;
  sender: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
}
