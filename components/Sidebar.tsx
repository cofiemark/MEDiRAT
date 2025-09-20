import React, { useRef, useState } from 'react';
import type { View } from '../App';
import { useAuth } from '../hooks/useAuth';
import { DashboardIcon } from './icons/DashboardIcon';
import { EquipmentIcon } from './icons/EquipmentIcon';
import { PlusIcon } from './icons/PlusIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/ChevronIcons';
import { ConfirmationDialog } from './ConfirmationDialog';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';

interface SidebarProps {
  currentView: View;
  onSetView: (view: View) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    isCollapsed: boolean;
}> = ({ icon, label, isActive, onClick, isCollapsed }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        {icon}
        {!isCollapsed && <span className="ml-4 font-medium">{label}</span>}
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSetView, isCollapsed, setIsCollapsed }) => {
    const { hasPermission, logout, user, updateUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user && updateUser) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newAvatarUrl = reader.result as string;
                updateUser({ ...user, avatarUrl: newAvatarUrl });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        logout();
        setIsLogoutDialogOpen(false);
    };
    
    return (
       <div className={`flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`flex items-center p-4 border-b border-gray-200 dark:border-gray-700 min-h-[72px] ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                 {!isCollapsed && <h1 className="text-xl font-bold text-gray-800 dark:text-white">MEDiRAT®</h1>}
            </div>
            <nav className="flex-grow p-2">
                <NavItem icon={<DashboardIcon className="w-6 h-6" />} label="Dashboard" isActive={currentView === 'dashboard'} onClick={() => onSetView('dashboard')} isCollapsed={isCollapsed} />
                <NavItem icon={<EquipmentIcon className="w-6 h-6" />} label="Equipment" isActive={['list', 'detail'].includes(currentView)} onClick={() => onSetView('list')} isCollapsed={isCollapsed} />
                {hasPermission('perform:assessment') && <NavItem icon={<ClipboardCheckIcon className="w-6 h-6" />} label="Assessment Form" isActive={currentView === 'assessment'} onClick={() => onSetView('assessment')} isCollapsed={isCollapsed} />}
                {hasPermission('add:equipment') && <NavItem icon={<PlusIcon className="w-6 h-6" />} label="Add Equipment" isActive={currentView === 'addEquipment'} onClick={() => onSetView('addEquipment')} isCollapsed={isCollapsed} />}
                {hasPermission('add:staff') && <NavItem icon={<UserPlusIcon className="w-6 h-6" />} label="Add Staff" isActive={currentView === 'addStaff'} onClick={() => onSetView('addStaff')} isCollapsed={isCollapsed} />}
            </nav>
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                {!isCollapsed && user && (
                    <div className="px-2 py-3 mb-2 flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <img 
                                src={user.avatarUrl} 
                                alt={user.name}
                                className="h-16 w-16 rounded-full object-cover mb-2 transition-opacity duration-300 group-hover:opacity-60"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white text-xs font-bold">Change</span>
                            </div>
                        </div>
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                    </div>
                )}
                <NavItem icon={<LogoutIcon className="w-6 h-6" />} label="Logout" isActive={false} onClick={() => setIsLogoutDialogOpen(true)} isCollapsed={isCollapsed} />
            </div>
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <NavItem
                    icon={isCollapsed ? <ChevronRightIcon className="w-6 h-6" /> : <ChevronLeftIcon className="w-6 h-6" />}
                    label="Collapse"
                    isActive={false}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    isCollapsed={isCollapsed}
                />
            </div>
            <ConfirmationDialog
                isOpen={isLogoutDialogOpen}
                title="Confirm Logout"
                message="Are you sure you want to log out of your account?"
                onConfirm={handleLogout}
                onCancel={() => setIsLogoutDialogOpen(false)}
                confirmText="Logout"
            />
        </div>
    );
};