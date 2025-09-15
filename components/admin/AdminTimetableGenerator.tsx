import React, { useState, useEffect, useMemo } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { ICONS } from "../../constants";
import {
  Department,
  Assignment,
  Teacher,
  Subject,
  TimetableSettings,
  Batch,
  TimetableGrid,
  GeneratedSlot,
} from "../../types";

interface Conflict {
  type:
    | "Unplaced Class"
    | "Teacher Clash"
    | "Utilization"
    | "Excessive Daily Load";
  description: string;
  level: "error" | "warning";
}

const TimetableDisplay: React.FC<{
  grid: TimetableGrid;
  settings: TimetableSettings;
  batches: Batch[];
  onReconfigure: () => void;
  onPublish?: () => void;
  isFinalized?: boolean;
}> = ({ grid, settings, batches, onReconfigure, onPublish, isFinalized }) => {
  return (
    <Card className="!p-0">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">
          {isFinalized ? "Finalized Timetable" : "Generated Timetable"}
        </h3>
        <div className="flex gap-2">
          {!isFinalized && onPublish && (
            <Button
              variant="secondary"
              onClick={onPublish}
              leftIcon={ICONS.publish}
            >
              Confirm & Publish
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onReconfigure}
            leftIcon={ICONS.settings}
          >
            {isFinalized ? "Reconfigure" : "Reconfigure"}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm text-center border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border border-slate-200 font-bold">Period</th>
              {settings.workingDays.map((day) => (
                <th key={day} className="p-2 border border-slate-200 font-bold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {settings.periodTimings.map((timing, index) => (
              <tr key={index}>
                <td className="p-2 border border-slate-200 font-bold bg-slate-50">
                  {timing}
                </td>
                {settings.workingDays.map((day) => {
                  const slotsForDay = grid[day]?.[index];
                  return (
                    <td
                      key={day}
                      className="p-1 border border-slate-200 align-top"
                    >
                      <div className="space-y-1">
                        {batches.map((batch, batchIndex) => {
                          const slot = slotsForDay?.[batchIndex];
                          return (
                            <div
                              key={batch.id}
                              className={`p-1.5 rounded text-xs ${
                                slot
                                  ? "bg-primary-50 text-primary-900"
                                  : "bg-slate-100"
                              }`}
                            >
                              <p className="font-extrabold text-black">
                                {batch.name}
                              </p>
                              {slot ? (
                                <>
                                  <p className="font-bold">
                                    {slot.subject.code}
                                  </p>
                                  <p className="text-slate-600 font-semibold">
                                    {slot.teacher.name}
                                  </p>
                                </>
                              ) : (
                                <p className="text-slate-400">- Free -</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const AdminTimetableGenerator: React.FC<{
  department: Department;
  onUpdateDepartment: (dept: Department) => void;
}> = ({ department, onUpdateDepartment }) => {
  const [view, setView] = useState<"CONFIG" | "GENERATED">("CONFIG");

  const [settings, setSettings] = useState<TimetableSettings>(
    department.settings
  );
  const [localTeachers, setLocalTeachers] = useState<Teacher[]>(
    department.teachers
  );
  const [localSubjects, setLocalSubjects] = useState<Subject[]>(
    department.subjects
  );
  const [localBatches, setLocalBatches] = useState<Batch[]>(department.batches);
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>(
    department.assignments
  );

  const [generatedGrid, setGeneratedGrid] = useState<TimetableGrid | null>(
    null
  );
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  const [newTeacherName, setNewTeacherName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");

  useEffect(() => {
    setSettings(department.settings);
    setLocalTeachers(department.teachers);
    setLocalSubjects(department.subjects);
    setLocalBatches(department.batches);
    setLocalAssignments(department.assignments);
    // If department has a finalized timetable, show it by default
    if (department.finalizedTimetable) {
      setGeneratedGrid(department.finalizedTimetable);
      setView("GENERATED");
    }
  }, [department]);

  const handleRunGenerator = () => {
    const newGrid: TimetableGrid = {};
    settings.workingDays.forEach((day) => {
      newGrid[day] = Array.from({ length: settings.periodsPerDay }, () =>
        Array(localBatches.length).fill(null)
      );
    });
    const teacherSchedule: Record<string, boolean> = {};
    const newConflicts: Conflict[] = [];

    let requiredClasses: {
      batch: Batch;
      batchIndex: number;
      subject: Subject;
      teacher: Teacher;
    }[] = [];
    localBatches.forEach((batch, batchIndex) => {
      batch.subjectIds.forEach((subjectId) => {
        const subject = localSubjects.find((s) => s.id === subjectId);
        const assignment = localAssignments.find(
          (a) => a.subjectId === subjectId
        );
        const teacher = localTeachers.find(
          (t) => t.id === assignment?.teacherId
        );

        if (subject && teacher && assignment) {
          for (let i = 0; i < assignment.weeklyLectures; i++) {
            requiredClasses.push({ batch, batchIndex, subject, teacher });
          }
        }
      });
    });

    requiredClasses.sort(() => Math.random() - 0.5);

    requiredClasses.forEach((reqClass) => {
      let placed = false;
      for (const day of settings.workingDays) {
        for (let period = 0; period < settings.periodsPerDay; period++) {
          const teacherKey = `${reqClass.teacher.id}-${day}-${period}`;
          if (
            newGrid[day][period][reqClass.batchIndex] === null &&
            !teacherSchedule[teacherKey]
          ) {
            newGrid[day][period][reqClass.batchIndex] = {
              subject: reqClass.subject,
              teacher: reqClass.teacher,
            };
            teacherSchedule[teacherKey] = true;
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
      if (!placed) {
        newConflicts.push({
          type: "Unplaced Class",
          description: `Could not schedule ${reqClass.subject.code} for ${reqClass.batch.name}`,
          level: "error",
        });
      }
    });

    const teacherWorkload: Record<string, number> = {};
    localTeachers.forEach((t) => (teacherWorkload[t.id] = 0));
    localAssignments.forEach((a) => {
      if (teacherWorkload[a.teacherId] !== undefined) {
        teacherWorkload[a.teacherId] += a.weeklyLectures;
      }
    });

    Object.entries(teacherWorkload).forEach(([teacherId, totalLectures]) => {
      const teacher = localTeachers.find((t) => t.id === teacherId);
      if (!teacher) return;
      if (totalLectures > 18) {
        newConflicts.push({
          type: "Utilization",
          description: `${teacher.name} is over-utilized with ${totalLectures} weekly lectures.`,
          level: "warning",
        });
      }
      if (totalLectures < 8 && totalLectures > 0) {
        newConflicts.push({
          type: "Utilization",
          description: `${teacher.name} may be under-utilized with only ${totalLectures} weekly lectures.`,
          level: "warning",
        });
      }
    });

    const dailyLoad: Record<string, Record<string, number>> = {};
    localTeachers.forEach((t) => (dailyLoad[t.id] = {}));

    settings.workingDays.forEach((day) => {
      for (let period = 0; period < settings.periodsPerDay; period++) {
        for (let batchIdx = 0; batchIdx < localBatches.length; batchIdx++) {
          const slot = newGrid[day][period][batchIdx];
          if (slot) {
            const teacherId = slot.teacher.id;
            dailyLoad[teacherId][day] = (dailyLoad[teacherId][day] || 0) + 1;
          }
        }
      }
    });

    Object.entries(dailyLoad).forEach(([teacherId, dayCounts]) => {
      const teacher = localTeachers.find((t) => t.id === teacherId);
      if (!teacher) return;
      Object.entries(dayCounts).forEach(([day, count]) => {
        if (count > settings.maxLecturesPerDay) {
          newConflicts.push({
            type: "Excessive Daily Load",
            description: `${teacher.name} has ${count} lectures on ${day}, exceeding the limit of ${settings.maxLecturesPerDay}.`,
            level: "error",
          });
        }
      });
    });

    setGeneratedGrid(newGrid);
    setConflicts(newConflicts);
    setView("GENERATED");
  };

  const handlePublish = () => {
    if (!generatedGrid) return;
    const updated: Department = {
      ...department,
      teachers: localTeachers,
      subjects: localSubjects,
      assignments: localAssignments,
      batches: localBatches,
      settings,
      finalizedTimetable: generatedGrid,
    };
    onUpdateDepartment(updated);
    alert(
      "Timetable confirmed and published. It will be shown as finalized for this department."
    );
  };

  const isConfigValid = useMemo(() => {
    return (
      localAssignments.every(
        (a) => a.teacherId && a.subjectId && a.weeklyLectures > 0
      ) &&
      localBatches.length > 0 &&
      localBatches.every((b) => b.subjectIds.length > 0) &&
      settings.workingDays.length > 0 &&
      settings.periodsPerDay > 0
    );
  }, [localAssignments, localBatches, settings]);

  const handleAddTeacher = () => {
    if (!newTeacherName.trim()) return;
    const newTeacher = { id: `t-${Date.now()}`, name: newTeacherName.trim() };
    setLocalTeachers((prev) => [...prev, newTeacher]);
    setNewTeacherName("");
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;
    const newSubject = {
      id: `s-${Date.now()}`,
      name: newSubjectName.trim(),
      code: newSubjectCode.trim(),
    };
    setLocalSubjects((prev) => [...prev, newSubject]);
    setNewSubjectName("");
    setNewSubjectCode("");
  };

  const handleAddAssignment = () => {
    setLocalAssignments((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        teacherId: "",
        subjectId: "",
        weeklyLectures: 1,
      },
    ]);
  };

  const handleUpdateAssignment = (
    index: number,
    field: keyof Assignment,
    value: string | number
  ) => {
    const updated = [...localAssignments];
    (updated[index] as any)[field] = value;
    setLocalAssignments(updated);
  };

  const handleRemoveAssignment = (id: string) => {
    setLocalAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetPeriodTimings = (newTimings: string[]) => {
    setSettings((s) => ({
      ...s,
      periodTimings: newTimings,
      periodsPerDay: newTimings.length,
    }));
  };

  const handleUpdateTiming = (index: number, value: string) => {
    const newTimings = [...(settings.periodTimings || [])];
    newTimings[index] = value;
    handleSetPeriodTimings(newTimings);
  };

  const handleRemoveTiming = (index: number) => {
    const newTimings = (settings.periodTimings || []).filter(
      (_, i) => i !== index
    );
    handleSetPeriodTimings(newTimings);
  };

  const handleAddTiming = () => {
    const lastTiming =
      settings.periodTimings[settings.periodTimings.length - 1] ||
      "16:00-17:00";
    const [_, endTime] = lastTiming.split("-");
    const [hourStr] = endTime.trim().split(":");
    const hour = parseInt(hourStr, 10);
    const nextHour = (hour + 1).toString().padStart(2, "0");
    const nextNextHour = (hour + 2).toString().padStart(2, "0");
    handleSetPeriodTimings([
      ...(settings.periodTimings || []),
      `${nextHour}:00-${nextNextHour}:00`,
    ]);
  };

  if (view === "GENERATED" && generatedGrid) {
    return (
      <div className="space-y-6">
        <TimetableDisplay
          grid={generatedGrid}
          settings={settings}
          batches={localBatches}
          onReconfigure={() => setView("CONFIG")}
          onPublish={department.finalizedTimetable ? undefined : handlePublish}
          isFinalized={Boolean(department.finalizedTimetable)}
        />
        <Card title="Conflict & Analysis Report">
          {conflicts.length > 0 ? (
            <ul className="space-y-2">
              {conflicts.map((c, i) => (
                <li
                  key={i}
                  className={`p-3 rounded text-sm ${
                    c.level === "error"
                      ? "bg-red-50 text-red-800"
                      : "bg-yellow-50 text-yellow-800"
                  }`}
                >
                  <span className="font-extrabold">{c.type}:</span>{" "}
                  {c.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-bold text-green-600">
              No major conflicts detected. Timetable seems viable.
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Timetable Generator Configuration
      </h3>
      <div className="space-y-6">
        {/* --- Settings --- */}
        <div className="p-4 border rounded-lg bg-slate-50">
          <h4 className="font-bold text-slate-900 mb-3">
            1. General Timings & Constraints
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div className="lg:col-span-3">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Working Days
              </label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.workingDays.includes(day)}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          workingDays: e.target.checked
                            ? [...s.workingDays, day]
                            : s.workingDays.filter((d) => d !== day),
                        }))
                      }
                      className="h-4 w-4 text-primary focus:ring-primary-500 border-slate-300 rounded"
                    />
                    <span className="font-semibold">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Class Period Timings
              </label>
              <div className="space-y-2">
                {settings.periodTimings?.map((timing, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={timing}
                      onChange={(e) =>
                        handleUpdateTiming(index, e.target.value)
                      }
                      placeholder="e.g., 09:00-10:00"
                      className="block w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm sm:text-sm"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="!p-2"
                      onClick={() => handleRemoveTiming(index)}
                    >
                      {ICONS.trash}
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={ICONS.add}
                onClick={handleAddTiming}
                className="mt-2 font-semibold"
              >
                Add Period
              </Button>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800">
                Periods per Day
              </label>
              <p className="text-lg font-bold text-slate-700 mt-1">
                {settings.periodsPerDay || 0}
              </p>
              <label
                htmlFor="maxLecturesPerDay"
                className="block text-sm font-bold text-slate-800 mt-4"
              >
                Max Daily Lectures / Teacher
              </label>
              <input
                type="number"
                id="maxLecturesPerDay"
                value={settings.maxLecturesPerDay}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    maxLecturesPerDay: parseInt(e.target.value, 10) || 1,
                  }))
                }
                min="1"
                max="10"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* --- Teachers & Subjects --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-3">
              2. Manage Teachers
            </h4>
            <div className="flex gap-2 mb-3">
              <input
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                placeholder="New Teacher Name"
                className="flex-grow block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm sm:text-sm"
              />
              <Button size="sm" onClick={handleAddTeacher}>
                Add
              </Button>
            </div>
            <ul className="text-sm space-y-1 max-h-24 overflow-y-auto">
              {localTeachers.map((t) => (
                <li
                  key={t.id}
                  className="p-1.5 bg-white rounded border font-semibold"
                >
                  {t.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-3">
              3. Manage Subjects
            </h4>
            <div className="flex gap-2 mb-3">
              <input
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Subject Name"
                className="flex-grow w-2/3 px-3 py-2 border rounded-md sm:text-sm"
              />
              <input
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                placeholder="Code"
                className="flex-grow w-1/3 px-3 py-2 border rounded-md sm:text-sm"
              />
              <Button size="sm" onClick={handleAddSubject}>
                Add
              </Button>
            </div>
            <ul className="text-sm space-y-1 max-h-24 overflow-y-auto">
              {localSubjects.map((s) => (
                <li key={s.id} className="p-1.5 bg-white rounded border">
                  <span className="font-bold">{s.code}</span> - {s.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Assignments --- */}
        <div className="p-4 border rounded-lg bg-slate-50">
          <h4 className="font-bold text-slate-900 mb-3">
            4. Assign Subjects & Workload
          </h4>
          <div className="space-y-2">
            {localAssignments.map((assignment, index) => (
              <div
                key={assignment.id}
                className="grid grid-cols-10 gap-2 items-center"
              >
                <select
                  value={assignment.teacherId}
                  onChange={(e) =>
                    handleUpdateAssignment(index, "teacherId", e.target.value)
                  }
                  className="col-span-4 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none sm:text-sm rounded-md font-medium"
                >
                  <option value="">Select Teacher</option>
                  {localTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <select
                  value={assignment.subjectId}
                  onChange={(e) =>
                    handleUpdateAssignment(index, "subjectId", e.target.value)
                  }
                  className="col-span-4 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none sm:text-sm rounded-md font-medium"
                >
                  <option value="">Select Subject</option>
                  {localSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={assignment.weeklyLectures}
                  onChange={(e) =>
                    handleUpdateAssignment(
                      index,
                      "weeklyLectures",
                      parseInt(e.target.value, 10)
                    )
                  }
                  min="1"
                  className="col-span-1 block w-full px-2 py-2 border border-slate-300 rounded-md shadow-sm sm:text-sm font-bold text-center"
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="col-span-1 !p-2"
                  onClick={() => handleRemoveAssignment(assignment.id)}
                >
                  {ICONS.trash}
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={ICONS.add}
            onClick={handleAddAssignment}
            className="mt-3 font-bold"
          >
            Add Assignment
          </Button>
        </div>

        <div className="mt-4 border-t pt-4">
          <Button
            onClick={handleRunGenerator}
            disabled={!isConfigValid}
            className="w-full"
            leftIcon={ICONS.play}
          >
            Generate Timetable
          </Button>
          {!isConfigValid && (
            <p className="text-xs text-red-500 mt-2 text-center font-semibold">
              Please ensure all assignments are complete, batches exist, and
              batches have subjects assigned.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AdminTimetableGenerator;
