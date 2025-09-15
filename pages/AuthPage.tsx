import React, { useState } from "react";
import { useAuth } from "../App";
import { UserRole } from "../types";
import Button from "../components/ui/Button";

const AuthForm: React.FC<{ isLogin: boolean }> = ({ isLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.Student);
  const [college, setCollege] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold text-slate-800"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-bold text-slate-800"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-bold text-slate-800"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          {Object.values(UserRole).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {!isLogin && (
        <div>
          <label
            htmlFor="college"
            className="block text-sm font-bold text-slate-800"
          >
            College / University
          </label>
          <div className="mt-1">
            <input
              id="college"
              name="college"
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary-500 border-slate-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-slate-900"
          >
            Remember me
          </label>
        </div>

        {isLogin && (
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-primary hover:text-primary-500"
            >
              Forgot your password?
            </a>
          </div>
        )}
      </div>

      <div>
        <Button type="submit" className="w-full">
          {isLogin ? "Sign in" : "Sign up"}
        </Button>
      </div>
    </form>
  );
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Smart Classroom Scheduler
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Welcome! Please {isLogin ? "sign in to" : "create"} your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 py-4 text-sm font-medium text-center ${
                  isLogin
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 py-4 text-sm font-medium text-center ${
                  !isLogin
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
          <AuthForm isLogin={isLogin} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
