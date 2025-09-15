import React, { useState } from "react";
import Card from "../components/ui/Card";
import { ICONS } from "../constants";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

interface ScheduleItem {
  course: string;
  faculty: string;
  room?: string;
  isSubstitute?: boolean;
  isCancelled?: boolean;
}

const WeeklyTimetable: React.FC = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    time: string;
    course?: string;
  } | null>(null);
  const [reportForm, setReportForm] = useState({
    issueType: "scheduling",
    description: "",
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
  ];

  const schedule: Record<string, (ScheduleItem | null)[]> = {
    Monday: [
      { course: "CS101", faculty: "Dr. A. Sharma", room: "R101" },
      { course: "MA203", faculty: "Dr. I. Mehta", room: "R203" },
      null,
      {
        course: "PY101",
        faculty: "Dr. E. Rao",
        room: "R105",
        isSubstitute: true,
      },
      null,
    ],
    Tuesday: [
      null,
      { course: "CS101", faculty: "Dr. A. Sharma", room: "R101" },
      { course: "MA203", faculty: "Dr. I. Mehta", room: "R203" },
      null,
      { course: "CS101 Lab", faculty: "Dr. A. Sharma", room: "Lab 3" },
    ],
    Wednesday: [
      { course: "MA203", faculty: "Dr. I. Mehta", room: "R203" },
      null,
      { course: "PY101", faculty: "Dr. E. Rao", room: "R105" },
      { course: "CS101", faculty: "Dr. A. Sharma", room: "R101" },
      null,
    ],
    Thursday: [
      { course: "PY101", faculty: "Dr. E. Rao", room: "R105" },
      { course: "CS101", faculty: "Dr. A. Sharma", room: "R101" },
      null,
      null,
      null,
    ],
    Friday: [
      { course: "MA203", faculty: "Dr. I. Mehta", room: "R203" },
      null,
      { course: "PY101", faculty: "Dr. E. Rao", room: "R105" },
      null,
      {
        course: "CS101 Lab",
        faculty: "Dr. A. Sharma",
        room: "Lab 3",
        isCancelled: true,
      },
    ],
  };

  const isToday = (day: string) =>
    new Date().toLocaleString("en-us", { weekday: "long" }) === day;

  const handleReportIssue = (day: string, time: string, course?: string) => {
    setSelectedSlot({ day, time, course });
    setReportForm({
      issueType: "scheduling",
      description: course
        ? `Issue with ${course} on ${day} at ${time}`
        : `Issue with empty slot on ${day} at ${time}`,
    });
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = () => {
    // In a real app, this would send the report to a backend
    alert(
      `Thank you for reporting this issue. Your report has been submitted.\n\nIssue Type: ${reportForm.issueType}\nDescription: ${reportForm.description}`
    );
    setIsReportModalOpen(false);
    setSelectedSlot(null);
    setReportForm({ issueType: "scheduling", description: "" });
  };

  return (
    <>
      <Card title="My Weekly Schedule" icon={ICONS.calendar} className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th scope="col" className="px-4 py-3 w-28">
                  Time
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    scope="col"
                    className={`px-4 py-3 ${
                      isToday(day) ? "bg-primary-100 text-primary-700" : ""
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, timeIndex) => (
                <tr key={time} className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-4 py-3 font-bold text-slate-800 bg-slate-50"
                  >
                    {time}
                  </th>
                  {days.map((day) => {
                    const slot = schedule[day]?.[timeIndex];
                    return (
                      <td
                        key={day}
                        className={`px-2 py-2 align-top ${
                          isToday(day) ? "bg-primary-50" : ""
                        }`}
                      >
                        {slot ? (
                          <div
                            className={`p-2 rounded ${
                              slot.isCancelled
                                ? "bg-red-50 text-red-900"
                                : slot.isSubstitute
                                ? "bg-amber-50 text-amber-900"
                                : "bg-primary-50 text-primary-900"
                            }`}
                            onClick={() =>
                              handleReportIssue(day, time, slot.course)
                            }
                          >
                            <div className="flex justify-between items-start">
                              <p className="font-bold">{slot.course}</p>
                              <button
                                className="text-xs text-slate-500 hover:text-slate-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReportIssue(day, time, slot.course);
                                }}
                              >
                                <span className="sr-only">Report</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                  <line x1="4" y1="22" x2="4" y2="15"></line>
                                </svg>
                              </button>
                            </div>
                            <p className="text-xs">{slot.faculty}</p>
                            <p className="text-xs">{slot.room}</p>
                            {slot.isSubstitute && (
                              <p className="text-xs font-semibold mt-1 text-amber-700">
                                Substitute Teacher
                              </p>
                            )}
                            {slot.isCancelled && (
                              <p className="text-xs font-semibold mt-1 text-red-700">
                                Cancelled
                              </p>
                            )}
                          </div>
                        ) : (
                          <div
                            className="h-16 cursor-pointer hover:bg-slate-50 rounded flex items-center justify-center"
                            onClick={() => handleReportIssue(day, time)}
                          >
                            <span className="text-xs text-slate-400 hover:text-slate-600">
                              Free Period
                            </span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-slate-600">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary-500 mr-1"></div>
              <span>Regular Class</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
              <span>Substitute Teacher</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span>Cancelled</span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<span role="img" aria-label="flag">🚩</span>}
            onClick={() => {
              setSelectedSlot(null);
              setReportForm({
                issueType: "general",
                description: "",
              });
              setIsReportModalOpen(true);
            }}
          >
            Report an Issue
          </Button>
        </div>
      </Card>

      {/* Report Issue Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Timetable Issue"
      >
        <div className="space-y-4">
          {selectedSlot && (
            <div className="p-3 bg-slate-50 rounded">
              <p className="font-medium">Reporting issue for:</p>
              <p className="text-sm">
                {selectedSlot.day}, {selectedSlot.time}
              </p>
              {selectedSlot.course && (
                <p className="text-sm font-medium">{selectedSlot.course}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Issue Type
            </label>
            <select
              value={reportForm.issueType}
              onChange={(e) =>
                setReportForm({ ...reportForm, issueType: e.target.value })
              }
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="scheduling">Scheduling Conflict</option>
              <option value="faculty">Faculty Issue</option>
              <option value="room">Room Assignment</option>
              <option value="timing">Timing Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={reportForm.description}
              onChange={(e) =>
                setReportForm({ ...reportForm, description: e.target.value })
              }
              rows={4}
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Please describe the issue in detail..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReport}>Submit Report</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const StudentStats: React.FC = () => {
  // Calculate total hours from the schedule
  const totalHours = 22;
  const totalCourses = 3;
  const attendanceRate = 95;

  return (
    <Card title="My Stats" icon={ICONS.analytics}>
      <div className="space-y-4">
        <div>
          <div className="text-4xl font-bold text-primary">{totalHours}</div>
          <p className="text-slate-600 font-semibold">
            Total Class Hours this Week
          </p>
        </div>

        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {totalCourses}
              </div>
              <p className="text-sm text-slate-600">Courses</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {attendanceRate}%
              </div>
              <p className="text-sm text-slate-600">Attendance</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface Notification {
  id: string;
  type: "SUBSTITUTE" | "CANCELLED" | "EVENT" | "ANNOUNCEMENT";
  title: string;
  text: string;
  time: string;
  isRead: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "SUBSTITUTE",
      title: "Substitute Teacher",
      text: "CS101 class at 10 AM will be taken by Dr. E. Rao instead of Dr. A. Sharma (absent).",
      time: "1h ago",
      isRead: false,
    },
    {
      id: "2",
      type: "CANCELLED",
      title: "Class Cancelled",
      text: "PY101 Lab scheduled for Friday at 2 PM has been cancelled.",
      time: "3h ago",
      isRead: false,
    },
    {
      id: "3",
      type: "EVENT",
      title: "Mandatory Event",
      text: 'Guest lecture on "AI in Modern Computing" in the main auditorium tomorrow at 11 AM. Attendance is mandatory.',
      time: "1d ago",
      isRead: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "SUBSTITUTE":
        return "blue";
      case "CANCELLED":
        return "red";
      case "EVENT":
        return "green";
      case "ANNOUNCEMENT":
        return "purple";
      default:
        return "slate";
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "SUBSTITUTE":
        return ICONS.user;
      case "CANCELLED":
        return ICONS.close;
      case "EVENT":
        return ICONS.calendar;
      case "ANNOUNCEMENT":
        return ICONS.notification;
      default:
        return ICONS.notification;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card
      title="Notifications"
      icon={ICONS.notification}
      action={
        unreadCount > 0 ? (
          <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        ) : undefined
      }
    >
      {notifications.length === 0 ? (
        <div className="text-center py-6 text-slate-500">
          <div className="text-4xl mb-2">📬</div>
          <p>No notifications</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex space-x-3 p-3 rounded-lg ${
                n.isRead ? "bg-white" : "bg-slate-50"
              }`}
            >
              <div
                className={`mt-1 text-${getTypeColor(
                  n.type
                )}-500 flex-shrink-0`}
              >
                {getTypeIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-slate-800">
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-500">{n.time}</p>
                </div>
                <p className="text-sm text-slate-600 mt-1">{n.text}</p>
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs text-primary-600 hover:text-primary-800 mt-2"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 pt-3 border-t flex justify-between items-center">
        <button className="text-xs text-slate-600 hover:text-slate-800">
          Mark all as read
        </button>
        <button className="text-xs text-primary-600 hover:text-primary-800">
          View all notifications
        </button>
      </div>
    </Card>
  );
};

const StudentDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-8">
        <WeeklyTimetable />
      </div>
      <div className="space-y-8">
        <StudentStats />
        <Notifications />
      </div>
    </div>
  );
};

export default StudentDashboard;
