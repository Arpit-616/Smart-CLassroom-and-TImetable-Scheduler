import React, { useState, useEffect } from "react";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminDataManager from "../components/admin/AdminDataManager";
import AdminTimetableGenerator from "../components/admin/AdminTimetableGenerator";
import { Department } from "../types";
import { sampleDepartments, ICONS } from "../constants";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import GlobalFacultyView from "../components/admin/GlobalFacultyView";
import GlobalConstraintsEditor from "../components/admin/GlobalConstraintsEditor";

type ViewMode =
  | "departmentSelection"
  | "departmentDashboard"
  | "globalFacultyView"
  | "globalConstraints";

const DepartmentSelector: React.FC<{
  departments: Department[];
  onSelect: (dept: Department) => void;
  onAdd: (name: string) => void;
  onShowGlobalView: () => void;
  onShowConstraints: () => void;
  onReset: () => void;
}> = ({
  departments,
  onSelect,
  onAdd,
  onShowGlobalView,
  onShowConstraints,
  onReset,
}) => {
  const [newDeptName, setNewDeptName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeptName.trim()) {
      onAdd(newDeptName.trim());
      setNewDeptName("");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800 text-center">
        Administrator Control Panel
      </h2>

      <Card title="Select a Department to Manage" icon={ICONS.building}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => onSelect(dept)}
              className="text-left p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-primary-50 transition-all duration-200 border"
            >
              <h3 className="text-lg font-semibold text-primary">
                {dept.name}
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {dept.teachers.length} Teachers
              </p>
              <p className="text-sm text-slate-500">
                {dept.subjects.length} Subjects
              </p>
            </button>
          ))}
          <div className="p-6 bg-slate-50 rounded-lg border">
            <form onSubmit={handleAdd} className="space-y-3">
              <h3 className="font-semibold text-slate-700">
                Create New Department
              </h3>
              <input
                type="text"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="e.g., Electrical Engineering"
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <Button type="submit" className="w-full" leftIcon={ICONS.add}>
                Add Department
              </Button>
            </form>
          </div>
        </div>
      </Card>

      <Card title="Overall Faculty Report" icon={ICONS.users}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-slate-600 max-w-2xl">
            Get a university-wide overview of all teachers, their total weekly
            workload, utilization status, and cross-departmental assignments.
          </p>
          <Button
            onClick={onShowGlobalView}
            variant="secondary"
            rightIcon={ICONS.analytics}
          >
            View Report
          </Button>
        </div>
      </Card>

      <Card title="Overall Constraints" icon={ICONS.settings}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-slate-600 max-w-2xl">
            Edit university-wide constraints such as total classrooms, active
            faculty, and total subjects across all departments.
          </p>
          <Button
            onClick={onShowConstraints}
            variant="secondary"
            rightIcon={ICONS.settings}
          >
            Edit Constraints
          </Button>
        </div>
      </Card>

      <Card title="Administrative Actions" icon={ICONS.settings}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-slate-600 max-w-2xl">
            Reset all department, teacher, subject, and timetable data back to
            the original demonstration state. This action cannot be undone.
          </p>
          <Button onClick={onReset} variant="danger">
            Reset All Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem("timetable_scheduler_departments");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to parse departments from localStorage:", error);
    }
    return sampleDepartments;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "timetable_scheduler_departments",
        JSON.stringify(departments)
      );
    } catch (error) {
      console.error("Failed to save departments to localStorage:", error);
    }
  }, [departments]);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("departmentSelection");

  const handleAddNewDepartment = (name: string) => {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name,
      teachers: [],
      subjects: [],
      assignments: [],
      batches: [],
      // FIX: Add missing 'classrooms' property to satisfy the Department type.
      classrooms: [],
      settings: {
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        periodsPerDay: 7,
        maxLecturesPerDay: 4,
        periodTimings: [
          "09:00 - 10:00",
          "10:00 - 11:00",
          "11:00 - 12:00",
          "13:00 - 14:00",
          "14:00 - 15:00",
          "15:00 - 16:00",
          "16:00 - 17:00",
        ],
      },
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const handleUpdateDepartment = (updatedDept: Department) => {
    const newDepartments = departments.map((d) =>
      d.id === updatedDept.id ? updatedDept : d
    );
    setDepartments(newDepartments);
    setSelectedDepartment(updatedDept); // Keep the view on the updated department
  };

  const handleSelectDepartment = (dept: Department) => {
    setSelectedDepartment(dept);
    setViewMode("departmentDashboard");
  };

  const handleReturnToSelection = () => {
    setSelectedDepartment(null);
    setViewMode("departmentSelection");
  };

  const handleShowGlobalView = () => {
    setViewMode("globalFacultyView");
  };

  const handleShowGlobalConstraints = () => {
    setViewMode("globalConstraints");
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data to the demo state? This cannot be undone."
      )
    ) {
      setDepartments(sampleDepartments);
      setSelectedDepartment(null);
      setViewMode("departmentSelection");
    }
  };

  if (viewMode === "departmentSelection") {
    return (
      <DepartmentSelector
        departments={departments}
        onSelect={handleSelectDepartment}
        onAdd={handleAddNewDepartment}
        onShowGlobalView={handleShowGlobalView}
        onShowConstraints={handleShowGlobalConstraints}
        onReset={handleResetData}
      />
    );
  }

  if (viewMode === "globalFacultyView") {
    return (
      <GlobalFacultyView
        departments={departments}
        onBack={handleReturnToSelection}
      />
    );
  }

  if (viewMode === "globalConstraints") {
    return (
      <GlobalConstraintsEditor
        departments={departments}
        onReturn={handleReturnToSelection}
        onUpdate={setDepartments}
      />
    );
  }

  if (viewMode === "departmentDashboard" && selectedDepartment) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">
            {selectedDepartment.name} Dashboard
          </h2>
          <Button
            variant="ghost"
            onClick={handleReturnToSelection}
            leftIcon={ICONS.arrowLeft}
          >
            Back to Selection
          </Button>
        </div>

        <AdminTimetableGenerator
          key={selectedDepartment.id} // Re-mount component on department change
          department={selectedDepartment}
          onUpdateDepartment={handleUpdateDepartment}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdminDataManager
            department={selectedDepartment}
            onUpdateDepartment={handleUpdateDepartment}
          />
          <AdminAnalytics department={selectedDepartment} />
        </div>
      </div>
    );
  }

  return null; // Fallback, should not be reached
};

export default AdminDashboard;
