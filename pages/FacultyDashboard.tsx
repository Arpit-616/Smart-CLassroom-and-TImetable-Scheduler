import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import { ICONS } from "../constants";
import { useAuth } from "../App";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { Department, TimetableGrid } from "../types";

interface ScheduleItem {
  course: string;
  room: string;
  students?: number;
  isSubstitute?: boolean;
}

const FacultySchedule: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    return new Date().toLocaleString("en-us", { weekday: "long" });
  });
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    time: string;
    course: string;
    room: string;
  } | null>(null);
  const [changeForm, setChangeForm] = useState({
    reason: "",
    preferredTime: "",
    preferredDay: "",
    swapWith: "",
    requestType: "reschedule",
  });

  // Build schedule from finalized timetable for the logged-in faculty
  const { days, timeSlots, schedule } = useMemo(() => {
    const empty = {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: [
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
      ],
      schedule: {} as Record<string, (ScheduleItem | null)[]>,
    };
    try {
      const saved = localStorage.getItem("timetable_scheduler_departments");
      const departments: Department[] = saved ? JSON.parse(saved) : [];
      const facultyName = user?.name || "";
      const dept =
        departments.find(
          (d) =>
            d.finalizedTimetable &&
            d.teachers.some((t) => t.name === facultyName)
        ) || departments.find((d) => d.finalizedTimetable);
      if (!dept || !dept.finalizedTimetable) return empty;
      const workingDays = dept.settings.workingDays;
      const periods = dept.settings.periodTimings;
      const grid: TimetableGrid = dept.finalizedTimetable;
      const built: Record<string, (ScheduleItem | null)[]> = {};
      workingDays.forEach((day) => {
        built[day] = periods.map((_, periodIndex) => {
          const slotsForPeriod = grid[day]?.[periodIndex] || [];
          const matchIndex = slotsForPeriod.findIndex(
            (slot) => slot && slot.teacher.name === facultyName
          );
          if (matchIndex === -1) return null;
          const slot = slotsForPeriod[matchIndex]!;
          return {
            course: slot.subject.code,
            room: "TBD",
            students: undefined,
          } as ScheduleItem;
        });
      });
      return { days: workingDays, timeSlots: periods, schedule: built };
    } catch (e) {
      return empty;
    }
  }, [user]);

  const isToday = (day: string) =>
    new Date().toLocaleString("en-us", { weekday: "long" }) === day;

  const handleRequestChange = (
    day: string,
    time: string,
    course: string,
    room: string
  ) => {
    setSelectedSlot({ day, time, course, room });
    setChangeForm({
      reason: "",
      preferredTime: "",
      preferredDay: "",
      swapWith: "",
      requestType: "reschedule",
    });
    setIsChangeModalOpen(true);
  };

  const handleSubmitChangeRequest = () => {
    try {
      const existingRaw = localStorage.getItem("timetable_scheduler_requests");
      const existing: any[] = existingRaw ? JSON.parse(existingRaw) : [];
      const newRequest = {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        requesterName: user?.name || "",
        type:
          changeForm.requestType === "swap"
            ? "SWAP"
            : changeForm.requestType === "substitute"
            ? "TAKEOVER"
            : changeForm.requestType === "cancel"
            ? "CANCEL"
            : "RESCHEDULE",
        from: {
          day: selectedSlot?.day || "",
          time: selectedSlot?.time || "",
          course: selectedSlot?.course || "",
        },
        to:
          changeForm.requestType === "reschedule"
            ? { day: changeForm.preferredDay, time: changeForm.preferredTime }
            : changeForm.requestType === "swap"
            ? { note: changeForm.swapWith }
            : undefined,
        reason: changeForm.reason,
        status: "PENDING",
      };
      localStorage.setItem(
        "timetable_scheduler_requests",
        JSON.stringify([newRequest, ...existing])
      );
      setIsChangeModalOpen(false);
      alert("Request submitted.");
    } catch (e) {
      alert("Failed to submit request.");
    }
  };

  const getTodayClasses = () => {
    const today = selectedDay;
    return timeSlots
      .map((time, index) => {
        const slot = schedule[today]?.[index];
        if (!slot) return null;

        return (
          <div
            key={`${today}-${index}`}
            className="mb-4 p-3 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{slot.course}</h3>
                <p className="text-sm text-slate-600">{time}</p>
                <p className="text-sm text-slate-600">Room: {slot.room}</p>
                <p className="text-sm text-slate-600">
                  Students: {slot.students}
                </p>
              </div>
              <div>
                {slot.isSubstitute ? (
                  <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                    Substitute
                  </span>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleRequestChange(today, time, slot.course, slot.room)
                    }
                  >
                    Request Change
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <>
      <Card
        title="My Personalized Schedule"
        icon={ICONS.calendar}
        className="!p-0"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "weekly" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("weekly")}
            >
              Weekly View
            </Button>
            <Button
              variant={viewMode === "daily" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("daily")}
            >
              Daily View
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {viewMode === "daily" && (
              <>
                <label className="text-sm font-medium text-slate-700">
                  Select Day:
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="text-sm border-slate-300 rounded-md"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                window.dispatchEvent(new Event("openCreateRequest"))
              }
            >
              Make Request
            </Button>
          </div>
        </div>

        {viewMode === "weekly" ? (
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
                        isToday(day)
                          ? "bg-secondary-100 text-secondary-800"
                          : ""
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
                    {days.map((day) => (
                      <td
                        key={day}
                        className={`px-2 py-2 align-top ${
                          isToday(day) ? "bg-secondary-50" : ""
                        }`}
                      >
                        {schedule[day]?.[timeIndex] ? (
                          <div
                            className={`p-2 rounded ${
                              schedule[day][timeIndex]?.isSubstitute
                                ? "bg-amber-50 text-amber-900"
                                : "bg-secondary-50 text-secondary-900"
                            } group`}
                          >
                            <div className="flex justify-between items-start">
                              <p className="font-bold">
                                {schedule[day][timeIndex]?.course}
                              </p>
                              {schedule[day][timeIndex]?.isSubstitute && (
                                <span className="text-xs bg-amber-200 text-amber-800 px-1 rounded">
                                  Sub
                                </span>
                              )}
                            </div>
                            <p className="text-xs">
                              Room: {schedule[day][timeIndex]?.room}
                            </p>
                            <p className="text-xs">
                              Students: {schedule[day][timeIndex]?.students}
                            </p>
                            {!schedule[day][timeIndex]?.isSubstitute && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="!p-1 !text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  handleRequestChange(
                                    day,
                                    time,
                                    schedule[day][timeIndex]?.course || "",
                                    schedule[day][timeIndex]?.room || ""
                                  )
                                }
                              >
                                Request Change
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center">
                            <span className="text-xs text-slate-400">
                              Free Period
                            </span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="font-medium text-lg mb-4">
              {selectedDay}'s Schedule
            </h3>
            {getTodayClasses().length > 0 ? (
              <div className="space-y-2">{getTodayClasses()}</div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>No classes scheduled for {selectedDay}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Class Change Request Modal */}
      <Modal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        title="Request Class Change"
      >
        <div className="space-y-4">
          {selectedSlot && (
            <div className="p-3 bg-slate-50 rounded">
              <p className="font-medium">Requesting change for:</p>
              <p className="text-sm font-medium">{selectedSlot.course}</p>
              <p className="text-sm">
                {selectedSlot.day}, {selectedSlot.time}
              </p>
              <p className="text-sm">Room: {selectedSlot.room}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Request Type
            </label>
            <select
              value={changeForm.requestType}
              onChange={(e) =>
                setChangeForm({ ...changeForm, requestType: e.target.value })
              }
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="reschedule">Reschedule Class</option>
              <option value="swap">Swap with Another Class</option>
              <option value="cancel">Request Cancellation</option>
              <option value="substitute">Request Substitute</option>
            </select>
          </div>

          {changeForm.requestType === "reschedule" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Preferred Day
                </label>
                <select
                  value={changeForm.preferredDay}
                  onChange={(e) =>
                    setChangeForm({
                      ...changeForm,
                      preferredDay: e.target.value,
                    })
                  }
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select a day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Preferred Time
                </label>
                <select
                  value={changeForm.preferredTime}
                  onChange={(e) =>
                    setChangeForm({
                      ...changeForm,
                      preferredTime: e.target.value,
                    })
                  }
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {changeForm.requestType === "swap" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Swap With
              </label>
              <select
                value={changeForm.swapWith}
                onChange={(e) =>
                  setChangeForm({ ...changeForm, swapWith: e.target.value })
                }
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Select a class</option>
                <option value="CS101-Tuesday">
                  CS101 (Tuesday, 10:00 - 11:00)
                </option>
                <option value="CS305-Monday">
                  CS305 (Monday, 11:00 - 12:00)
                </option>
                <option value="CS305-Friday">
                  CS305 (Friday, 10:00 - 11:00)
                </option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason
            </label>
            <textarea
              value={changeForm.reason}
              onChange={(e) =>
                setChangeForm({ ...changeForm, reason: e.target.value })
              }
              rows={3}
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Please provide a reason for this request..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setIsChangeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitChangeRequest}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const FacultyStats: React.FC = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    type: "casual",
  });

  const workloadData = {
    weeklyHours: 16,
    totalClasses: 8,
    totalStudents: 144,
    leavesRemaining: 8,
    leavesUsed: 4,
    substituteDuties: 2,
  };

  const handleSubmitLeaveRequest = () => {
    // In a real app, this would send the request to a backend
    alert(
      `Your leave request has been submitted.\n\nType: ${leaveForm.type}\nDates: ${leaveForm.startDate} to ${leaveForm.endDate}\nReason: ${leaveForm.reason}`
    );
    setIsLeaveModalOpen(false);
    setLeaveForm({
      startDate: "",
      endDate: "",
      reason: "",
      type: "casual",
    });
  };

  return (
    <>
      <Card title="Workload & Leave Balance" icon={ICONS.analytics}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-4xl font-bold text-secondary">
                {workloadData.weeklyHours}
              </div>
              <p className="text-slate-600 font-semibold">Weekly Hours</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">
                {workloadData.leavesRemaining}
              </div>
              <p className="text-slate-600 font-semibold">Leaves Remaining</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-slate-800">
                  {workloadData.totalClasses}
                </div>
                <p className="text-xs text-slate-600">Classes</p>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">
                  {workloadData.totalStudents}
                </div>
                <p className="text-xs text-slate-600">Students</p>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">
                  {workloadData.substituteDuties}
                </div>
                <p className="text-xs text-slate-600">Substitutes</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-600">
                Leave Balance:{" "}
                <span className="font-medium">
                  {workloadData.leavesRemaining}/
                  {workloadData.leavesRemaining + workloadData.leavesUsed}
                </span>
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsLeaveModalOpen(true)}
            >
              Request Leave
            </Button>
          </div>
        </div>
      </Card>

      {/* Leave Request Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Request Leave"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Leave Type
            </label>
            <select
              value={leaveForm.type}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, type: e.target.value })
              }
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="earned">Earned Leave</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={leaveForm.startDate}
                onChange={(e) =>
                  setLeaveForm({ ...leaveForm, startDate: e.target.value })
                }
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={leaveForm.endDate}
                onChange={(e) =>
                  setLeaveForm({ ...leaveForm, endDate: e.target.value })
                }
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason
            </label>
            <textarea
              value={leaveForm.reason}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, reason: e.target.value })
              }
              rows={3}
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Please provide a reason for your leave request..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitLeaveRequest}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

interface FacultyNotification {
  id: string;
  type: "SUBSTITUTE" | "LEAVE" | "CHANGE" | "ANNOUNCEMENT";
  title: string;
  text: string;
  time: string;
  isRead: boolean;
  isUrgent?: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<FacultyNotification[]>([
    {
      id: "1",
      type: "SUBSTITUTE",
      title: "Substitute Duty",
      text: "You have been allotted as a substitute teacher for MA203 (Dr. I. Mehta) on Wednesday at 9 AM in room B-203.",
      time: "2h ago",
      isRead: false,
      isUrgent: true,
    },
    {
      id: "2",
      type: "LEAVE",
      title: "Leave Approved",
      text: "Reminder: Your leave request for next Monday has been approved.",
      time: "1d ago",
      isRead: true,
    },
    {
      id: "3",
      type: "CHANGE",
      title: "Schedule Change",
      text: "Your request to reschedule CS101 from Monday 9 AM to Tuesday 11 AM has been approved.",
      time: "2d ago",
      isRead: false,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getTypeColor = (type: FacultyNotification["type"]) => {
    switch (type) {
      case "SUBSTITUTE":
        return "amber";
      case "LEAVE":
        return "green";
      case "CHANGE":
        return "blue";
      case "ANNOUNCEMENT":
        return "purple";
      default:
        return "slate";
    }
  };

  const getTypeIcon = (type: FacultyNotification["type"]) => {
    switch (type) {
      case "SUBSTITUTE":
        return ICONS.user;
      case "LEAVE":
        return ICONS.calendar;
      case "CHANGE":
        return ICONS.rearrange;
      case "ANNOUNCEMENT":
        return ICONS.notification;
      default:
        return ICONS.notification;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const urgentCount = notifications.filter(
    (n) => n.isUrgent && !n.isRead
  ).length;

  return (
    <Card
      title="Notifications"
      icon={ICONS.notification}
      action={
        <div className="flex items-center space-x-2">
          {urgentCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {urgentCount} urgent
            </span>
          )}
          {unreadCount > 0 && (
            <span className="bg-secondary-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
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
                n.isUrgent && !n.isRead
                  ? "bg-red-50"
                  : n.isRead
                  ? "bg-white"
                  : "bg-slate-50"
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
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-slate-800">
                      {n.title}
                    </p>
                    {n.isUrgent && !n.isRead && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{n.time}</p>
                </div>
                <p className="text-sm text-slate-600 mt-1">{n.text}</p>
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs text-secondary-600 hover:text-secondary-800 mt-2"
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
        <button
          className="text-xs text-slate-600 hover:text-slate-800"
          onClick={() =>
            setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
          }
        >
          Mark all as read
        </button>
        <button className="text-xs text-secondary-600 hover:text-secondary-800">
          View all notifications
        </button>
      </div>
    </Card>
  );
};

const FacultyDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-8">
        <FacultySchedule />
        <RequestsSection />
      </div>
      <div className="space-y-8">
        <FacultyStats />
        <Notifications />
      </div>
    </div>
  );
};

interface FacultyRequestItem {
  id: string;
  createdAt: string;
  requesterName: string;
  type: "SWAP" | "RESCHEDULE" | "TAKEOVER" | "CANCEL";
  from: { day: string; time: string; course: string };
  to?: any;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
}

const RequestsSection: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FacultyRequestItem[]>([]);
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: "RESCHEDULE" as "SWAP" | "RESCHEDULE" | "TAKEOVER" | "CANCEL",
    fromDay: "",
    fromTime: "",
    fromCourse: "",
    toDay: "",
    toTime: "",
    swapWith: "",
    reason: "",
  });

  const daysAndSlots = useMemo(() => {
    try {
      const saved = localStorage.getItem("timetable_scheduler_departments");
      const departments: Department[] = saved ? JSON.parse(saved) : [];
      const dept = departments[0];
      if (!dept) {
        return {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          slots: [
            "09:00 - 10:00",
            "10:00 - 11:00",
            "11:00 - 12:00",
            "13:00 - 14:00",
            "14:00 - 15:00",
          ],
        };
      }
      return {
        days: dept.settings.workingDays,
        slots: dept.settings.periodTimings,
      };
    } catch (e) {
      return {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        slots: [
          "09:00 - 10:00",
          "10:00 - 11:00",
          "11:00 - 12:00",
          "13:00 - 14:00",
          "14:00 - 15:00",
        ],
      };
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("timetable_scheduler_requests");
      const all: FacultyRequestItem[] = raw ? JSON.parse(raw) : [];
      const mine = all.filter((r) => r.requesterName === (user?.name || ""));
      setRequests(mine);
    } catch (e) {
      setRequests([]);
    }
  }, [user]);

  useEffect(() => {
    const handler = () => setIsCreateOpen(true);
    window.addEventListener("openCreateRequest", handler);
    return () => window.removeEventListener("openCreateRequest", handler);
  }, []);

  const visible = requests.filter((r) =>
    filter === "ALL" ? true : r.status === filter
  );

  const cancelRequest = (id: string) => {
    const raw = localStorage.getItem("timetable_scheduler_requests");
    const all: FacultyRequestItem[] = raw ? JSON.parse(raw) : [];
    const updated = all.map((r) =>
      r.id === id ? { ...r, status: "CANCELLED" } : r
    );
    localStorage.setItem(
      "timetable_scheduler_requests",
      JSON.stringify(updated)
    );
    setRequests(updated.filter((r) => r.requesterName === (user?.name || "")));
  };

  const handleCreateSubmit = () => {
    if (!createForm.fromDay || !createForm.fromTime || !createForm.fromCourse) {
      alert("Please fill From Day, From Time and Course.");
      return;
    }
    try {
      const raw = localStorage.getItem("timetable_scheduler_requests");
      const all: FacultyRequestItem[] = raw ? JSON.parse(raw) : [];
      const newRequest: FacultyRequestItem = {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        requesterName: user?.name || "",
        type: createForm.type,
        from: {
          day: createForm.fromDay,
          time: createForm.fromTime,
          course: createForm.fromCourse,
        },
        to:
          createForm.type === "RESCHEDULE"
            ? { day: createForm.toDay, time: createForm.toTime }
            : createForm.type === "SWAP"
            ? { note: createForm.swapWith }
            : undefined,
        reason: createForm.reason,
        status: "PENDING",
      };
      const updated = [newRequest, ...all];
      localStorage.setItem(
        "timetable_scheduler_requests",
        JSON.stringify(updated)
      );
      setIsCreateOpen(false);
      setCreateForm({
        type: "RESCHEDULE",
        fromDay: "",
        fromTime: "",
        fromCourse: "",
        toDay: "",
        toTime: "",
        swapWith: "",
        reason: "",
      });
      setRequests(
        updated.filter((r) => r.requesterName === (user?.name || ""))
      );
      alert("Request created.");
    } catch (e) {
      alert("Failed to create request.");
    }
  };

  return (
    <Card
      title="Requests"
      icon={ICONS.rearrange}
      action={
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-xs border-slate-300 rounded"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsCreateOpen(true)}
          >
            Make Request
          </Button>
        </div>
      }
    >
      {visible.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No requests yet. Use "Request Change" on a class to create one.</p>
        </div>
      ) : (
        <ul className="divide-y">
          {visible.map((r) => (
            <li key={r.id} className="py-3 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    {r.type}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {r.from.course} — {r.from.day} {r.from.time}
                </p>
                {r.type === "RESCHEDULE" && r.to?.day && r.to?.time && (
                  <p className="text-xs text-slate-600">
                    Requested: {r.to.day}, {r.to.time}
                  </p>
                )}
                {r.type === "SWAP" && r.to?.note && (
                  <p className="text-xs text-slate-600">
                    Swap with: {r.to.note}
                  </p>
                )}
                {r.reason && (
                  <p className="text-xs text-slate-600 mt-1">
                    Reason: {r.reason}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.status === "PENDING"
                      ? "bg-amber-100 text-amber-800"
                      : r.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : r.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {r.status}
                </span>
                {r.status === "PENDING" && (
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelRequest(r.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Make a Request"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Request Type
            </label>
            <select
              value={createForm.type}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, type: e.target.value as any }))
              }
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="RESCHEDULE">Reschedule</option>
              <option value="SWAP">Swap</option>
              <option value="TAKEOVER">Substitute/Takeover</option>
              <option value="CANCEL">Cancel</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                From Day
              </label>
              <select
                value={createForm.fromDay}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, fromDay: e.target.value }))
                }
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Select</option>
                {daysAndSlots.days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                From Time
              </label>
              <select
                value={createForm.fromTime}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, fromTime: e.target.value }))
                }
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Select</option>
                {daysAndSlots.slots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course
              </label>
              <input
                value={createForm.fromCourse}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, fromCourse: e.target.value }))
                }
                placeholder="e.g., CS101"
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>

          {createForm.type === "RESCHEDULE" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Preferred Day
                </label>
                <select
                  value={createForm.toDay}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, toDay: e.target.value }))
                  }
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select</option>
                  {daysAndSlots.days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Preferred Time
                </label>
                <select
                  value={createForm.toTime}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, toTime: e.target.value }))
                  }
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select</option>
                  {daysAndSlots.slots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {createForm.type === "SWAP" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Swap With
              </label>
              <input
                value={createForm.swapWith}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, swapWith: e.target.value }))
                }
                placeholder="e.g., CS305 (Mon 11:00 - 12:00)"
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason
            </label>
            <textarea
              value={createForm.reason}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, reason: e.target.value }))
              }
              rows={3}
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Please provide a reason for this request..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit}>Submit</Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default FacultyDashboard;
