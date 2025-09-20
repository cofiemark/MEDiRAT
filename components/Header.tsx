import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { BellIcon } from './icons/BellIcon';
import type { AppNotification } from '../types';

interface HeaderProps {
    onToggleNotifications: () => void;
    notifications: AppNotification[];
}

export const Header: React.FC<HeaderProps> = ({ onToggleNotifications, notifications }) => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const unacknowledgedCount = notifications.length;

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
            <div>
                {/* Could add breadcrumbs or page title here */}
            </div>
            <div className="flex items-center space-x-6">
                 <button onClick={onToggleNotifications} className="relative text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
                    <BellIcon className="h-6 w-6"/>
                    {unacknowledgedCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {unacknowledgedCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={toggleTheme}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                </button>
                <div className="flex items-center space-x-3">
                    {user?.avatarUrl && (
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    )}
                    <div className="text-right">
                        <p className="font-semibold text-gray-800 dark:text-white">{user?.name || 'Guest'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role || ''}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};