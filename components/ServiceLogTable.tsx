import React from 'react';
import type { MaintenanceLog } from '../types';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { exportToCSV } from '../services/exportService';

interface ServiceLogTableProps {
  maintenanceHistory: MaintenanceLog[];
  equipmentName: string;
}

export const ServiceLogTable: React.FC<ServiceLogTableProps> = ({ maintenanceHistory, equipmentName }) => {
  
  const handleExport = () => {
    exportToCSV({
      data: maintenanceHistory,
      headers: [
        { key: 'date', label: 'Date' },
        { key: 'technician', label: 'Technician' },
        { key: 'workPerformed', label: 'Work Performed' },
        { key: 'partsUsed', label: 'Parts Used' },
        { key: 'notes', label: 'Notes' },
        { key: 'status', label: 'Status After Service' },
      ],
      filename: `service-history-${equipmentName.replace(/\s+/g, '-')}`,
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <WrenchScrewdriverIcon className="w-6 h-6 mr-2 text-gray-500" />
          Service History
        </h3>
        <button 
          onClick={handleExport}
          className="flex items-center space-x-2 px-3 py-1.5 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Export service history to CSV"
        >
          <DownloadIcon className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Technician</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Work Performed</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {maintenanceHistory.length > 0 ? maintenanceHistory.map(log => (
              <tr key={log.id}>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{log.date.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{log.technician}</td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{log.workPerformed}</td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{log.notes}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">No service history available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};