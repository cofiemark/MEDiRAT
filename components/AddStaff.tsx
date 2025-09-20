import React from 'react';
import { UserRole } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { IdentificationIcon } from './icons/IdentificationIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface AddStaffProps {
    onStaffAdded: () => void;
}

export const AddStaff: React.FC<AddStaffProps> = ({ onStaffAdded }) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would collect form data and send it to an API
        console.log('New staff form submitted.');
        onStaffAdded();
    };
    
    const staffRoles = [UserRole.Technician, UserRole.HospitalStaff];

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Add New Staff Member</h2>
            <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" id="fullName" required className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-3 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="John Doe" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                     <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" id="email" required className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-3 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="you@example.com" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="tel" id="phone" className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-3 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="(555) 987-6543" />
                    </div>
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                     <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select id="role" className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-3 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                           {staffRoles.map(role => <option key={role}>{role}</option>)}
                        </select>
                    </div>
                </div>
                <div className="pt-5">
                    <div className="flex justify-end">
                         <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Add Staff Member
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};