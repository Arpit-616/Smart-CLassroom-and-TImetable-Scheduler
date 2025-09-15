import React, { useMemo } from "react";
import { Department } from "../../types";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { ICONS } from "../../constants";

interface GlobalFacultyViewProps {
  departments: Department[];
  onBack: () => void;
}

interface TeacherWorkload {
  teacherName: string;
  totalHours: number;
  departmentCount: number;
  assignments: {
    deptName: string;
    subjectName: string;
    hours: number;
  }[];
}

const GlobalFacultyView: React.FC<GlobalFacultyViewProps> = ({
  departments,
  onBack,
}) => {
  const teacherWorkloads = useMemo(() => {
    const workloadMap = new Map<
      string,
      Omit<TeacherWorkload, "departmentCount">
    >();

    departments.forEach((dept) => {
      dept.assignments.forEach((asg) => {
        const teacher = dept.teachers.find((t) => t.id === asg.teacherId);
        const subject = dept.subjects.find((s) => s.id === asg.subjectId);

        if (teacher && subject) {
          const entry = workloadMap.get(teacher.name) || {
            teacherName: teacher.name,
            totalHours: 0,
            assignments: [],
          };

          entry.totalHours += asg.weeklyLectures;
          entry.assignments.push({
            deptName: dept.name,
            subjectName: subject.name,
            hours: asg.weeklyLectures,
          });

          workloadMap.set(teacher.name, entry);
        }
      });
    });

    const workloadsWithDeptCount: TeacherWorkload[] = Array.from(
      workloadMap.values()
    ).map((workload) => {
      const departmentCount = new Set(
        workload.assignments.map((a) => a.deptName)
      ).size;
      return { ...workload, departmentCount };
    });

    return workloadsWithDeptCount.sort((a, b) => b.totalHours - a.totalHours);
  }, [departments]);

  const getStatus = (hours: number): { text: string; className: string } => {
    if (hours > 18) {
      return { text: "Over-utilized", className: "bg-red-100 text-red-800" };
    }
    if (hours < 10) {
      return {
        text: "Under-utilized",
        className: "bg-yellow-100 text-yellow-800",
      };
    }
    return { text: "Optimal", className: "bg-green-100 text-green-800" };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Overall Faculty Utilization Report
        </h2>
        <Button variant="ghost" onClick={onBack} leftIcon={ICONS.arrowLeft}>
          Back to Selection
        </Button>
      </div>

      <Card className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Faculty Name
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Total Weekly Hours
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Assignments & Departments
                </th>
              </tr>
            </thead>
            <tbody>
              {teacherWorkloads.map((teacher) => {
                const status = getStatus(teacher.totalHours);
                return (
                  <tr
                    key={teacher.teacherName}
                    className="bg-white border-b hover:bg-slate-50"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap"
                    >
                      <div className="font-extrabold text-base">
                        {teacher.teacherName}
                      </div>
                      {teacher.departmentCount > 1 ? (
                        <div className="text-xs font-bold text-secondary">
                          {teacher.departmentCount} Departments
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">
                          {teacher.assignments[0]?.deptName || ""}
                        </div>
                      )}
                    </th>
                    <td className="px-6 py-4 text-center font-semibold text-lg">
                      {teacher.totalHours}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="space-y-1 text-xs">
                        {teacher.assignments.map((asg, index) => (
                          <li key={index}>
                            <span className="font-semibold">
                              {asg.subjectName}
                            </span>{" "}
                            ({asg.hours} hrs)
                            <span className="text-slate-400">
                              {" "}
                              - {asg.deptName}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default GlobalFacultyView;
