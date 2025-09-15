
import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, UserRole } from './types';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { sampleUsers } from './constants';
import Layout from './components/Layout';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = useCallback((email: string, role: UserRole) => {
        const foundUser = sampleUsers.find(u => u.email === email && u.role === role);
        if (foundUser) {
            setUser(foundUser);
        } else {
            // In a real app, you'd show an error.
            // For this prototype, we'll create a new user on the fly if not found.
            const newUser: User = {
                id: `user-${Date.now()}`,
                name: email.split('@')[0],
                email: email,
                role: role,
                college: 'State University'
            };
            setUser(newUser);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


const AppRoutes: React.FC = () => {
    const { user } = useAuth();
    
    if (!user) {
        return (
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
        );
    }

    return (
        <Layout>
            <Routes>
                {user.role === UserRole.Admin && <Route path="/dashboard" element={<AdminDashboard />} />}
                {user.role === UserRole.Faculty && <Route path="/dashboard" element={<FacultyDashboard />} />}
                {user.role === UserRole.Student && <Route path="/dashboard" element={<StudentDashboard />} />}
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Layout>
    );
};


function App() {
    return (
        <AuthProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AuthProvider>
    );
}

export default App;
