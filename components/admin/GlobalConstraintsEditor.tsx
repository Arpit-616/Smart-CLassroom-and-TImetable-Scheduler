import React, { useState } from "react";
import { Department } from "../../types";
import { ICONS } from "../../constants";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface OverallConstraints {
  totalClassrooms: number;
  activeFaculty: number;
  totalSubjects: number;
}

interface OverallConstraintsEditorProps {
  departments: Department[];
  onReturn: () => void;
  onUpdate: (departments: Department[]) => void;
}

const GlobalConstraintsEditor: React.FC<OverallConstraintsEditorProps> = ({
  departments,
  onReturn,
  onUpdate,
}) => {
  const [constraints, setConstraints] = useState<OverallConstraints>(() => {
    // Calculate initial values from all departments
    const totalClassrooms = departments.reduce(
      (sum, dept) => sum + (dept.classrooms?.length || 0),
      0
    );
    const activeFaculty = departments.reduce(
      (sum, dept) => sum + dept.teachers.length,
      0
    );
    const totalSubjects = departments.reduce(
      (sum, dept) => sum + dept.subjects.length,
      0
    );

    return { totalClassrooms, activeFaculty, totalSubjects };
  });

  const handleSave = () => {
    // This is a simplified implementation - in a real app, you'd need more complex logic
    // to distribute these constraints across departments

    // For this demo, we'll just update the first department with these constraints
    // by adding or removing items to match the totals

    let updatedDepartments = [...departments];

    // Example: Adjust classrooms
    if (updatedDepartments.length > 0 && updatedDepartments[0].classrooms) {
      const currentTotal = departments.reduce(
        (sum, dept) => sum + (dept.classrooms?.length || 0),
        0
      );
      const diff = constraints.totalClassrooms - currentTotal;

      if (diff > 0) {
        // Add more classrooms to the first department
        const newClassrooms = Array.from({ length: diff }, (_, i) => ({
          id: `c-auto-${Date.now()}-${i}`,
          name: `Auto-Room-${i + 1}`,
          capacity: 50,
          equipment: ["Whiteboard"],
        }));

        updatedDepartments[0] = {
          ...updatedDepartments[0],
          classrooms: [...updatedDepartments[0].classrooms, ...newClassrooms],
        };
      } else if (diff < 0) {
        // Remove classrooms from departments (simplified approach)
        let remaining = Math.abs(diff);

        updatedDepartments = updatedDepartments.map((dept) => {
          if (
            remaining <= 0 ||
            !dept.classrooms ||
            dept.classrooms.length === 0
          )
            return dept;

          const removeCount = Math.min(remaining, dept.classrooms.length);
          remaining -= removeCount;

          return {
            ...dept,
            classrooms: dept.classrooms.slice(
              0,
              dept.classrooms.length - removeCount
            ),
          };
        });
      }
    }

    // Adjust faculty members
    if (updatedDepartments.length > 0) {
      const currentTotal = departments.reduce(
        (sum, dept) => sum + dept.teachers.length,
        0
      );
      const diff = constraints.activeFaculty - currentTotal;

      if (diff > 0) {
        // Add more faculty to the first department
        const newFaculty = Array.from({ length: diff }, (_, i) => ({
          id: `t-auto-${Date.now()}-${i}`,
          name: `Auto Teacher ${i + 1}`,
          subjects: [],
          availability: Array(7).fill(Array(10).fill(true)),
          maxHours: 20,
        }));

        updatedDepartments[0] = {
          ...updatedDepartments[0],
          teachers: [...updatedDepartments[0].teachers, ...newFaculty],
        };
      } else if (diff < 0) {
        // Remove faculty from departments (simplified approach)
        let remaining = Math.abs(diff);

        updatedDepartments = updatedDepartments.map((dept) => {
          if (remaining <= 0 || dept.teachers.length === 0) return dept;

          const removeCount = Math.min(remaining, dept.teachers.length);
          remaining -= removeCount;

          return {
            ...dept,
            teachers: dept.teachers.slice(
              0,
              dept.teachers.length - removeCount
            ),
          };
        });
      }
    }

    // Adjust subjects
    if (updatedDepartments.length > 0) {
      const currentTotal = departments.reduce(
        (sum, dept) => sum + dept.subjects.length,
        0
      );
      const diff = constraints.totalSubjects - currentTotal;

      if (diff > 0) {
        // Add more subjects to the first department
        const newSubjects = Array.from({ length: diff }, (_, i) => ({
          id: `s-auto-${Date.now()}-${i}`,
          name: `Auto Subject ${i + 1}`,
          code: `AS${i + 1}`,
          credits: 3,
          hoursPerWeek: 4,
        }));

        updatedDepartments[0] = {
          ...updatedDepartments[0],
          subjects: [...updatedDepartments[0].subjects, ...newSubjects],
        };
      } else if (diff < 0) {
        // Remove subjects from departments (simplified approach)
        let remaining = Math.abs(diff);

        updatedDepartments = updatedDepartments.map((dept) => {
          if (remaining <= 0 || dept.subjects.length === 0) return dept;

          const removeCount = Math.min(remaining, dept.subjects.length);
          remaining -= removeCount;

          return {
            ...dept,
            subjects: dept.subjects.slice(
              0,
              dept.subjects.length - removeCount
            ),
          };
        });
      }
    }

    onUpdate(updatedDepartments);
    onReturn();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          Overall Constraints
        </h2>
        <Button onClick={onReturn} variant="ghost" leftIcon={ICONS.arrowLeft}>
          Back to Dashboard
        </Button>
      </div>

      <Card title="University-wide Constraints" icon={ICONS.settings}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Total Classrooms
            </label>
            <input
              type="number"
              min="1"
              value={constraints.totalClassrooms}
              onChange={(e) =>
                setConstraints({
                  ...constraints,
                  totalClassrooms: parseInt(e.target.value) || 0,
                })
              }
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <p className="mt-1 text-sm text-slate-500">
              Current:{" "}
              {departments.reduce(
                (sum, dept) => sum + (dept.classrooms?.length || 0),
                0
              )}{" "}
              classrooms
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Active Faculty
            </label>
            <input
              type="number"
              min="1"
              value={constraints.activeFaculty}
              onChange={(e) =>
                setConstraints({
                  ...constraints,
                  activeFaculty: parseInt(e.target.value) || 0,
                })
              }
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <p className="mt-1 text-sm text-slate-500">
              Current:{" "}
              {departments.reduce((sum, dept) => sum + dept.teachers.length, 0)}{" "}
              faculty members
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Total Subjects
            </label>
            <input
              type="number"
              min="1"
              value={constraints.totalSubjects}
              onChange={(e) =>
                setConstraints({
                  ...constraints,
                  totalSubjects: parseInt(e.target.value) || 0,
                })
              }
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <p className="mt-1 text-sm text-slate-500">
              Current:{" "}
              {departments.reduce((sum, dept) => sum + dept.subjects.length, 0)}{" "}
              subjects
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Overall Constraints
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GlobalConstraintsEditor;
