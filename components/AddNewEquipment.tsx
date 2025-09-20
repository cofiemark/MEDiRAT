import React from 'react';
import { Department, EquipmentStatus } from '../types';

interface AddNewEquipmentProps {
    onEquipmentAdded: () => void;
}

export const AddNewEquipment: React.FC<AddNewEquipmentProps> = ({ onEquipmentAdded }) => {
    
    // In a real app, you'd use useState for each field and have a proper submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would collect form data and send it to an API
        console.log('New equipment form submitted.');
        onEquipmentAdded();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Add New Equipment</h2>
            <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Equipment Name</label>
                        <input type="text" id="name" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3" />
                    </div>
                     <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
                        <input type="text" id="model" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3" />
                    </div>
                     <div>
                        <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Serial Number</label>
                        <input type="text" id="serialNumber" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3" />
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                        <select id="department" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3">
                            {Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <select id="status" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3">
                            {Object.values(EquipmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="maintenanceIntervalDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Interval (Days)</label>
                        <input type="number" id="maintenanceIntervalDays" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3" />
                    </div>
                </div>
                 <div className="pt-5">
                    <div className="flex justify-end">
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Save Equipment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};