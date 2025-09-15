import React from "react";
import {
  User,
  UserRole,
  TimetableSlot,
  FacultyMember,
  Department,
  Classroom,
} from "./types";

export const sampleUsers: User[] = [
  {
    id: "1",
    name: "prof.sandeep",
    email: "admin@school.edu",
    role: UserRole.Admin,
    college: "State University",
  },
  {
    id: "2",
    name: "Dr.tanwi",
    email: "faculty@school.edu",
    role: UserRole.Faculty,
    college: "State University",
  },
  {
    id: "3",
    name: "prof.sachin",
    email: "student@school.edu",
    role: UserRole.Student,
    college: "State University",
  },
];

export const ICONS = {
  login: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
      />
    </svg>
  ),
  dashboard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),
  analytics: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  notification: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  ),
  add: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  close: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  logout: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  settings: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  user: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  ),
  users: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  ),
  calendar: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  book: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
    </svg>
  ),
  building: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 11-2 0V4H6v12a1 1 0 11-2 0V4zm5 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm3 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  play: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
        clipRule="evenodd"
      />
    </svg>
  ),
  publish: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  rearrange: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  check: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  trash: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
        clipRule="evenodd"
      />
    </svg>
  ),
  arrowLeft: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export const sampleTimetable: TimetableSlot[] = [
  {
    id: "ts1",
    time: "09:00 - 10:00",
    course: "CS101 - Intro to Programming",
    faculty: "Dr. A. Sharma",
    room: "A-101",
    isLab: false,
  },
  {
    id: "ts2",
    time: "10:00 - 11:00",
    course: "MA203 - Calculus II",
    faculty: "Dr. I. Mehta",
    room: "B-203",
    isLab: false,
  },
  {
    id: "ts3",
    time: "11:00 - 12:00",
    course: "PY101 - Physics I",
    faculty: "Dr. E. Rao",
    room: "C-305",
    isLab: false,
  },
  {
    id: "ts4",
    time: "12:00 - 13:00",
    course: "LUNCH BREAK",
    faculty: "",
    room: "",
    isLab: false,
  },
  {
    id: "ts5",
    time: "13:00 - 15:00",
    course: "CS101-L - Programming Lab",
    faculty: "Dr. A. Sharma",
    room: "Lab-1",
    isLab: true,
  },
];

export const sampleFacultyWorkload: FacultyMember[] = [
  { id: "f1", name: "A. Sharma", department: "CS", workload: 18 },
  { id: "f2", name: "I. Mehta", department: "Math", workload: 16 },
  { id: "f3", name: "E. Rao", department: "Physics", workload: 20 },
  { id: "f4", name: "J. Iyer", department: "Biology", workload: 14 },
  { id: "f5", name: "R. Menon", department: "CS", workload: 22 },
];

export const sampleDepartments: Department[] = [
  {
    id: "dept-cse",
    name: "Computer Science & Engineering",
    teachers: [
      { id: "t1", name: "Dr. Tanwi" },
      { id: "t2", name: "Prof. Sandeep" },
      { id: "t3", name: "Prof. Sachin" },
    ],
    subjects: [
      { id: "s1", name: "Intro to Programming", code: "CS101" },
      { id: "s2", name: "Data Structures", code: "CS201" },
      { id: "s3", name: "Algorithms", code: "CS305" },
    ],
    assignments: [
      { id: "a1", teacherId: "t1", subjectId: "s1", weeklyLectures: 4 },
      { id: "a2", teacherId: "t2", subjectId: "s2", weeklyLectures: 4 },
      { id: "a3", teacherId: "t1", subjectId: "s3", weeklyLectures: 3 },
      { id: "a6", teacherId: "t3", subjectId: "s2", weeklyLectures: 4 },
    ],
    batches: [
      { id: "b1", name: "Batch A (Year 1)", subjectIds: ["s1", "s2"] },
      { id: "b2", name: "Batch B (Year 2)", subjectIds: ["s2", "s3"] },
    ],
    classrooms: [
      {
        id: "c1",
        name: "CS-101",
        capacity: 60,
        equipment: ["Projector", "Whiteboard"],
      },
      {
        id: "c2",
        name: "CS-102",
        capacity: 70,
        equipment: ["Projector", "Smartboard"],
      },
      {
        id: "c3",
        name: "CS Lab A",
        capacity: 40,
        equipment: ["Computers", "Projector"],
      },
    ],
    settings: {
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      periodsPerDay: 5,
      maxLecturesPerDay: 3,
      periodTimings: [
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
      ],
    },
  },
  {
    id: "dept-it",
    name: "Information Technology",
    teachers: [
      { id: "t4", name: "Dr. J. Iyer" },
      { id: "t2", name: "Dr. I. Mehta" }, // Same teacher as in CSE
    ],
    subjects: [
      { id: "s4", name: "Networking", code: "IT202" },
      { id: "s5", name: "Cyber Security", code: "IT405" },
    ],
    assignments: [
      { id: "a4", teacherId: "t4", subjectId: "s4", weeklyLectures: 5 },
      { id: "a5", teacherId: "t2", subjectId: "s5", weeklyLectures: 5 },
    ],
    batches: [{ id: "b3", name: "Batch C (Year 3)", subjectIds: ["s4", "s5"] }],
    classrooms: [
      {
        id: "c4",
        name: "IT-201",
        capacity: 50,
        equipment: ["Projector", "Whiteboard"],
      },
      {
        id: "c5",
        name: "IT-202",
        capacity: 60,
        equipment: ["Projector", "Smartboard"],
      },
    ],
    settings: {
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      periodsPerDay: 6,
      maxLecturesPerDay: 4,
      periodTimings: [
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
      ],
    },
  },
  {
    id: "dept-me",
    name: "Mechanical Engineering",
    teachers: [],
    subjects: [],
    assignments: [],
    batches: [],
    classrooms: [],
    settings: {
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      periodsPerDay: 7,
      maxLecturesPerDay: 4,
      periodTimings: [
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
      ],
    },
  },
  {
    id: "dept-ds",
    name: "CSE (Data Science)",
    teachers: [],
    subjects: [],
    assignments: [],
    batches: [],
    classrooms: [],
    settings: {
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      periodsPerDay: 5,
      maxLecturesPerDay: 3,
      periodTimings: [
        "09:30 - 10:30",
        "10:30 - 11:30",
        "11:30 - 12:30",
        "13:30 - 14:30",
        "14:30 - 15:30",
      ],
    },
  },
];
