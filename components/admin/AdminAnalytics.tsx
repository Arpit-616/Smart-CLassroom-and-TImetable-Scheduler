import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { ICONS, sampleFacultyWorkload, sampleTimetable } from '../../constants';
import { Department } from '../../types';

const TimetableGrid: React.FC = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 15:00'];

    const schedule: { [key: string]: { [key: string]: any } } = {};
    sampleTimetable.forEach(slot => {
        if (!schedule[slot.time]) {
            schedule[slot.time] = {};
        }
        // Simplified: just putting the first class found for a given day/time for display
        schedule[slot.time]['Monday'] = slot; 
    });


    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                    <tr>
                        <th scope="col" className="px-6 py-3 rounded-tl-lg">Time</th>
                        {days.map(day => <th key={day} scope="col" className="px-6 py-3">{day}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map(time => (
                        <tr key={time} className="bg-white border-b">
                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{time}</th>
                            {days.map(day => {
                                // For this example, we'll just populate Monday from sample data
                                const slot = day === 'Monday' && sampleTimetable.find(s => s.time === time);
                                return (
                                    <td key={day} className="px-6 py-4">
                                        {slot ? (
                                             <div className={`p-2 rounded ${slot.isLab ? 'bg-secondary-50 text-secondary-800' : 'bg-primary-50 text-primary-800'}`}>
                                                <p className="font-semibold">{slot.course}</p>
                                                <p className="text-xs">{slot.faculty} in {slot.room}</p>
                                            </div>
                                        ) : slot?.faculty === '' ? (
                                            <div className="p-2 rounded bg-slate-200 text-slate-600 text-center font-semibold">
                                                {slot.course}
                                            </div>
                                        ): (
                                            <div className="h-12"></div>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const FacultyWorkloadChart: React.FC = () => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={sampleFacultyWorkload} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="workload" fill="#17A2B8" name="Weekly Hours" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const AlertsWidget: React.FC = () => {
    const alerts = [
        { type: 'Fixed Slot', text: 'Prof.Arpit - Conference Hall @ Fri 2 PM' },
        { type: 'Leave', text: 'Prof.Sachinon leave next week' },
        { type: 'Fixed Slot', text: 'Guest Lecture - Auditorium @ Tue 11 AM' },
    ];
    return (
        <ul className="space-y-3">
            {alerts.map((alert, index) => (
                <li key={index} className="flex items-start space-x-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${alert.type === 'Leave' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>{alert.type}</span>
                    <p className="text-sm text-slate-700">{alert.text}</p>
                </li>
            ))}
        </ul>
    );
};


const AdminAnalytics: React.FC<{ department: Department }> = ({ department }) => {
    return (
        <div className="space-y-6">
             <Card title={`Weekly Timetable Overview - ${department.name}`} className="lg:col-span-3 !p-0">
                <TimetableGrid />
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title={`Faculty Workload - ${department.name}`} className="lg:col-span-2">
                    <FacultyWorkloadChart />
                </Card>
                <Card title="Alerts & Fixed Slots">
                    <AlertsWidget />
                </Card>
            </div>
        </div>
    );
};

export default AdminAnalytics;