import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Password is for UI demonstration only
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Example emails to try: manager@medirat.com, tech@medirat.com, staff@medirat.com
    const success = await login(email);
    
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
    // On success, the App component will automatically switch views.
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MEDiRAT® Login</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Access your equipment management dashboard</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
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
                className="w-full px-3 py-2.5 text-gray-900 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Use: manager@medirat.com, tech@medirat.com, or staff@medirat.com</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className="w-full px-3 py-2.5 text-gray-900 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="********"
              />
            </div>
             <p className="mt-2 text-xs text-gray-500">Any password will work for this demo.</p>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};