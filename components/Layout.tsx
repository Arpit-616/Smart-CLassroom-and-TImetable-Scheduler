import React from 'react';
import { useAuth } from '../App';
import { ICONS } from '../constants';
import { UserRole } from '../types';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case UserRole.Admin: return 'bg-red-500';
            case UserRole.Faculty: return 'bg-blue-500';
            case UserRole.Student: return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };
    
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 text-secondary font-bold text-xl">
                           Scheduler
                        </div>
                        <h1 className="text-slate-900 text-lg font-bold">{user?.role} Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-slate-500 hover:text-primary">
                            {ICONS.notification}
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                                <p className={`text-xs px-2 py-0.5 rounded-full text-white inline-block ${getRoleColor(user?.role || UserRole.Student)}`}>{user?.role}</p>
                            </div>
                            <button onClick={logout} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary" title="Logout">
                                {ICONS.logout}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-100">
            <Header />
            <main>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;