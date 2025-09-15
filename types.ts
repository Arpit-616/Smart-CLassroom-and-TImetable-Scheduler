export enum UserRole {
  Admin = "Administrator",
  Faculty = "Faculty",
  Student = "Student",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  college: string;
}

export interface TimetableSlot {
  id: string;
  time: string;
  course: string;
  faculty: string;
  room: string;
  isLab: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
}

export interface FacultyMember {
  id: string;
  name: string;
  department: string;
  workload: number;
}

// --- Department-centric Data Structures ---

export interface Teacher {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Assignment {
  id: string;
  teacherId: string;
  subjectId: string;
  weeklyLectures: number;
}

export interface Batch {
  id: string;
  name: string;
  subjectIds: string[];
}

export interface TimetableSettings {
  workingDays: string[];
  periodsPerDay: number;
  maxLecturesPerDay: number;
  periodTimings: string[];
}

export interface GeneratedSlot {
  subject: Subject;
  teacher: Teacher;
}

// Fix: Corrected the TimetableGrid type to be a dictionary of days to a 2D array of slots (period x batch).
export type TimetableGrid = Record<string, (GeneratedSlot | null)[][]>;

export interface Department {
  id: string;
  name: string;
  teachers: Teacher[];
  subjects: Subject[];
  assignments: Assignment[];
  batches: Batch[];
  classrooms: Classroom[];
  settings: TimetableSettings;
  finalizedTimetable?: TimetableGrid;
}
