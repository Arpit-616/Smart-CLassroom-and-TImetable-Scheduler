import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { Department, Teacher, Subject, Batch, Classroom, TimetableSettings } from '../../types';

type Tab = 'Teachers' | 'Subjects' | 'Batches' | 'Classrooms' | 'Constraints';

const TeacherManager: React.FC<{ department: Department; onUpdate: (dept: Department) => void }> = ({ department, onUpdate }) => {
    const [name, setName] = useState('');
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        const newTeacher: Teacher = { id: `t-${Date.now()}`, name };
        onUpdate({ ...department, teachers: [...department.teachers, newTeacher] });
        setName('');
    };
    const handleRemove = (id: string) => {
        onUpdate({ ...department, teachers: department.teachers.filter(t => t.id !== id) });
    };
    return (
        <div>
            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="New Teacher Name" className="flex-grow block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                <Button type="submit" leftIcon={ICONS.add}>Add</Button>
            </form>
            <ul className="space-y-2">
                {department.teachers.map(t => (
                    <li key={t.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="font-bold">{t.name}</span>
                        <button onClick={() => handleRemove(t.id)} className="text-red-500 hover:text-red-700">{ICONS.trash}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SubjectManager: React.FC<{ department: Department; onUpdate: (dept: Department) => void }> = ({ department, onUpdate }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !code.trim()) return;
        const newSubject: Subject = { id: `s-${Date.now()}`, name, code };
        onUpdate({ ...department, subjects: [...department.subjects, newSubject] });
        setName('');
        setCode('');
    };
     const handleRemove = (id: string) => {
        onUpdate({ ...department, subjects: department.subjects.filter(s => s.id !== id) });
    };
    return (
        <div>
            <form onSubmit={handleAdd} className="space-y-2 mb-4">
                <div className="flex gap-2">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Subject Name" className="flex-grow w-full px-3 py-2 border rounded-md sm:text-sm" />
                    <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Subject Code" className="w-1/3 px-3 py-2 border rounded-md sm:text-sm" />
                </div>
                <Button type="submit" leftIcon={ICONS.add} className="w-full">Add Subject</Button>
            </form>
            <ul className="space-y-2">
                {department.subjects.map(s => (
                     <li key={s.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="font-bold">{s.code} - {s.name}</span>
                        <button onClick={() => handleRemove(s.id)} className="text-red-500 hover:text-red-700">{ICONS.trash}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const BatchManager: React.FC<{ department: Department; onUpdate: (dept: Department) => void }> = ({ department, onUpdate }) => {
    const [name, setName] = useState('');
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        const newBatch: Batch = { id: `b-${Date.now()}`, name, subjectIds: [] };
        onUpdate({ ...department, batches: [...department.batches, newBatch] });
        setName('');
    };
    const handleRemove = (id: string) => {
        onUpdate({ ...department, batches: department.batches.filter(b => b.id !== id) });
    };

    const handleToggleSubject = (batchId: string, subjectId: string) => {
        const updatedBatches = department.batches.map(batch => {
            if (batch.id === batchId) {
                const subjectIds = batch.subjectIds.includes(subjectId)
                    ? batch.subjectIds.filter(id => id !== subjectId)
                    : [...batch.subjectIds, subjectId];
                return { ...batch, subjectIds };
            }
            return batch;
        });
        onUpdate({ ...department, batches: updatedBatches });
    };

    return (
        <div>
            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="New Batch Name (e.g., Year 1)" className="flex-grow block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                <Button type="submit" leftIcon={ICONS.add}>Add</Button>
            </form>
            <div className="space-y-4">
                {department.batches.map(b => (
                    <div key={b.id} className="p-3 bg-slate-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-extrabold">{b.name}</span>
                            <button onClick={() => handleRemove(b.id)} className="text-red-500 hover:text-red-700">{ICONS.trash}</button>
                        </div>
                        <p className="text-sm font-bold text-slate-600 mb-2">Assign Subjects:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {department.subjects.length > 0 ? department.subjects.map(subj => (
                                <label key={subj.id} className="flex items-center space-x-2 p-1.5 bg-white rounded border cursor-pointer hover:bg-primary-50">
                                    <input
                                        type="checkbox"
                                        checked={b.subjectIds.includes(subj.id)}
                                        onChange={() => handleToggleSubject(b.id, subj.id)}
                                        className="h-4 w-4 text-primary focus:ring-primary-500 border-slate-300 rounded"
                                    />
                                    <span className="font-semibold">{subj.code}</span>
                                    <span>{subj.name}</span>
                                </label>
                            )) : <p className="text-slate-500">Please add subjects first.</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ClassroomManager: React.FC<{ department: Department; onUpdate: (dept: Department) => void }> = ({ department, onUpdate }) => {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [equipment, setEquipment] = useState('');
    
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !capacity.trim()) return;
        const newClassroom: Classroom = {
            id: `c-${Date.now()}`,
            name,
            capacity: parseInt(capacity, 10),
            equipment: equipment.split(',').map(item => item.trim()).filter(Boolean)
        };
        onUpdate({ ...department, classrooms: [...(department.classrooms || []), newClassroom] });
        setName('');
        setCapacity('');
        setEquipment('');
    };

    const handleRemove = (id: string) => {
        onUpdate({ ...department, classrooms: department.classrooms.filter(c => c.id !== id) });
    };

    return (
        <div>
            <form onSubmit={handleAdd} className="space-y-3 mb-4 p-3 bg-slate-50 rounded-lg border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold">Classroom Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., CS-101" className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm" />
                    </div>
                    <div>
                        <label className="text-sm font-bold">Capacity</label>
                        <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="e.g., 60" className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm" />
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-bold">Equipment (comma-separated)</label>
                    <input type="text" value={equipment} onChange={e => setEquipment(e.target.value)} placeholder="e.g., Projector, Whiteboard" className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm" />
                </div>
                <Button type="submit" leftIcon={ICONS.add} className="w-full">Add Classroom</Button>
            </form>
             <ul className="space-y-2">
                {(department.classrooms || []).map(c => (
                     <li key={c.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <div>
                            <span className="font-bold">{c.name}</span>
                            <span className="text-sm text-slate-500 ml-2">(Cap: {c.capacity})</span>
                            <p className="text-xs text-slate-600">{c.equipment.join(', ')}</p>
                        </div>
                        <button onClick={() => handleRemove(c.id)} className="text-red-500 hover:text-red-700">{ICONS.trash}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const ConstraintsManager: React.FC<{ department: Department; onUpdate: (dept: Department) => void }> = ({ department, onUpdate }) => {
    const [settings, setSettings] = useState<TimetableSettings>(department.settings);
    
    const handleSave = () => {
        onUpdate({ ...department, settings });
    };
    
    const handleWorkingDayToggle = (day: string) => {
        const updatedDays = settings.workingDays.includes(day)
            ? settings.workingDays.filter(d => d !== day)
            : [...settings.workingDays, day];
        setSettings({ ...settings, workingDays: updatedDays });
    };
    
    const handlePeriodsChange = (value: number) => {
        // Ensure we have enough period timings
        let periodTimings = [...settings.periodTimings];
        if (value > periodTimings.length) {
            // Add more default timings if needed
            for (let i = periodTimings.length; i < value; i++) {
                periodTimings.push(`Period ${i+1}`);
            }
        } else if (value < periodTimings.length) {
            // Trim if reducing
            periodTimings = periodTimings.slice(0, value);
        }
        
        setSettings({
            ...settings,
            periodsPerDay: value,
            periodTimings
        });
    };
    
    const handleTimingChange = (index: number, value: string) => {
        const updatedTimings = [...settings.periodTimings];
        updatedTimings[index] = value;
        setSettings({ ...settings, periodTimings: updatedTimings });
    };
    
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
        <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border">
                <h3 className="font-bold text-lg mb-4">Working Days</h3>
                <div className="flex flex-wrap gap-2">
                    {allDays.map(day => (
                        <button
                            key={day}
                            onClick={() => handleWorkingDayToggle(day)}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${settings.workingDays.includes(day) ? 'bg-primary text-white' : 'bg-white border text-slate-700'}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg border">
                <h3 className="font-bold text-lg mb-4">Class Periods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Number of Periods Per Day</label>
                        <input 
                            type="number" 
                            min="1" 
                            max="10"
                            value={settings.periodsPerDay} 
                            onChange={(e) => handlePeriodsChange(parseInt(e.target.value) || 1)}
                            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Lectures Per Day</label>
                        <input 
                            type="number" 
                            min="1" 
                            max={settings.periodsPerDay}
                            value={settings.maxLecturesPerDay} 
                            onChange={(e) => setSettings({ ...settings, maxLecturesPerDay: parseInt(e.target.value) || 1 })}
                            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg border">
                <h3 className="font-bold text-lg mb-4">Period Timings</h3>
                <div className="space-y-3">
                    {settings.periodTimings.map((timing, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="font-medium text-slate-700 w-24">Period {index + 1}:</span>
                            <input 
                                type="text" 
                                value={timing} 
                                onChange={(e) => handleTimingChange(index, e.target.value)}
                                placeholder="e.g., 09:00 - 10:00"
                                className="flex-grow px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>
            
            <Button onClick={handleSave} className="w-full">
                Save Constraints
            </Button>
        </div>
    );
};

const AdminDataManager: React.FC<{ department: Department; onUpdateDepartment: (dept: Department) => void; }> = ({ department, onUpdateDepartment }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Teachers');
    const tabs: Tab[] = ['Teachers', 'Subjects', 'Batches', 'Classrooms', 'Constraints'];

    const tabIcons = {
        Teachers: ICONS.user,
        Subjects: ICONS.book,
        Batches: ICONS.users,
        Classrooms: ICONS.building,
        Constraints: ICONS.settings,
    };
    
    const renderContent = () => {
        switch(activeTab) {
            case 'Teachers':
                return <TeacherManager department={department} onUpdate={onUpdateDepartment} />;
            case 'Subjects':
                return <SubjectManager department={department} onUpdate={onUpdateDepartment} />;
            case 'Batches':
                return <BatchManager department={department} onUpdate={onUpdateDepartment} />;
            case 'Classrooms':
                return <ClassroomManager department={department} onUpdate={onUpdateDepartment} />;
            case 'Constraints':
                return <ConstraintsManager department={department} onUpdate={onUpdateDepartment} />;
            default:
                return null;
        }
    };

    return (
        <Card>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center space-x-2 whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm ${
                                activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            {tabIcons[tab]}
                            <span>{tab}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Manage {activeTab} for {department.name}</h3>
                {renderContent()}
            </div>
        </Card>
    );
};

export default AdminDataManager;