import React, { useState, useMemo } from 'react';
import type { EquipmentWithNextService } from '../App';
import type { DashboardFilter } from '../types';
import { Department, EquipmentStatus, RiskLevel } from '../types';
import { RISK_LEVELS, getRiskLevelFromRPN } from '../constants';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { exportToCSV } from '../services/exportService';
import { ChevronUpIcon, ChevronDownIcon } from './icons/ChevronIcons';

interface EquipmentListProps {
  equipment: EquipmentWithNextService[];
  onSelectEquipment: (id: string) => void;
  activeFilter: DashboardFilter | null;
  setActiveFilter: (filter: DashboardFilter | null) => void;
}

type SortableKey = 'name' | 'department' | 'status' | 'riskLevel' | 'nextServiceDate';
type SortDirection = 'ascending' | 'descending';

interface SortConfig {
  key: SortableKey;
  direction: SortDirection;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({ equipment, onSelectEquipment, activeFilter, setActiveFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedAndFilteredEquipment = useMemo(() => {
    let list = [...equipment];
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    // Apply dashboard filter first
    if (activeFilter) {
      switch(activeFilter) {
        case 'overdue':
          list = list.filter(e => e.status === EquipmentStatus.NeedsMaintenance || e.status === EquipmentStatus.OutOfService);
          break;
        case 'upcoming':
          list = list.filter(e => e.nextServiceDate > now && e.nextServiceDate <= thirtyDaysFromNow);
          break;
        case 'highRisk':
          list = list.filter(e => {
              if (e.riskAssessments.length === 0) return false;
              const latestRpn = e.riskAssessments.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0].rpn;
              const riskLevel = getRiskLevelFromRPN(latestRpn);
              return [RiskLevel.High, RiskLevel.Critical, RiskLevel.Severe].includes(riskLevel);
          });
          break;
        case 'operational':
          list = list.filter(e => e.status === EquipmentStatus.Operational);
          break;
      }
    }

    // Apply search and department filters
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(lowerCaseSearch) ||
        e.model.toLowerCase().includes(lowerCaseSearch) ||
        e.serialNumber.toLowerCase().includes(lowerCaseSearch) ||
        e.inventoryCode.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (departmentFilter !== 'all') {
      list = list.filter(e => e.department === departmentFilter);
    }
    
    // Map to include calculated risk level for sorting
    const enrichedList = list.map(e => {
        const latestAssessment = e.riskAssessments.length > 0
            ? [...e.riskAssessments].sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0]
            : null;
        const riskLevel = latestAssessment ? getRiskLevelFromRPN(latestAssessment.rpn) : RiskLevel.Negligible;
        return { ...e, riskLevel };
    });

    // Apply sorting
    if (sortConfig !== null) {
      enrichedList.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        let comparison = 0;
        if (aValue > bValue) {
          comparison = 1;
        } else if (aValue < bValue) {
          comparison = -1;
        }
        
        return sortConfig.direction === 'descending' ? comparison * -1 : comparison;
      });
    }

    return enrichedList;
  }, [equipment, searchTerm, departmentFilter, activeFilter, sortConfig]);
  
  const requestSort = (key: SortableKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortableKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
  };

  const clearFilters = () => {
    setActiveFilter(null);
    setSearchTerm('');
    setDepartmentFilter('all');
    setSortConfig(null);
  }
  
  const handleExport = () => {
    const dataToExport = sortedAndFilteredEquipment.map(item => {
      return {
        name: item.name,
        model: item.model,
        serialNumber: item.serialNumber,
        inventoryCode: item.inventoryCode,
        department: item.department,
        status: item.status,
        nextServiceDate: item.nextServiceDate,
        riskLevel: item.riskLevel,
      };
    });

    exportToCSV({
      data: dataToExport,
      headers: [
        { key: 'name', label: 'Name' },
        { key: 'model', label: 'Model' },
        { key: 'serialNumber', label: 'Serial Number' },
        { key: 'inventoryCode', label: 'Inventory Code' },
        { key: 'department', label: 'Department' },
        { key: 'status', label: 'Status' },
        { key: 'nextServiceDate', label: 'Next Service Date' },
        { key: 'riskLevel', label: 'Risk Level' },
      ],
      filename: `equipment-list-${new Date().toISOString().split('T')[0]}`,
    });
  };

  const SortableHeader: React.FC<{ sortKey: SortableKey; children: React.ReactNode }> = ({ sortKey, children }) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
      <button onClick={() => requestSort(sortKey)} className="flex items-center space-x-1 group focus:outline-none">
        <span className="group-hover:text-gray-700 dark:group-hover:text-gray-100">{children}</span>
        <span className="opacity-50 group-hover:opacity-100">{getSortIcon(sortKey)}</span>
      </button>
    </th>
  );


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Equipment List</h2>
        <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value as Department | 'all')}
                className="py-2.5 px-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="all">All Departments</option>
                {Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
            <button 
              onClick={handleExport} 
              className="flex items-center space-x-2 px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Export to CSV"
            >
              <DownloadIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
        </div>
      </div>
      
      {activeFilter && (
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex justify-between items-center">
          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
            Filtering by: <span className="font-bold capitalize">{activeFilter.replace(/([A-Z])/g, ' $1')}</span>
          </p>
          <button onClick={() => setActiveFilter(null)} className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 hover:underline">Clear</button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <SortableHeader sortKey="name">Name / Model</SortableHeader>
                  <SortableHeader sortKey="department">Department</SortableHeader>
                  <SortableHeader sortKey="status">Status</SortableHeader>
                  <SortableHeader sortKey="riskLevel">Risk Level</SortableHeader>
                  <SortableHeader sortKey="nextServiceDate">Next Service</SortableHeader>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedAndFilteredEquipment.map(item => {
                  const riskInfo = RISK_LEVELS[item.riskLevel];

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === EquipmentStatus.Operational ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                            item.status === EquipmentStatus.NeedsMaintenance ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                            item.status === EquipmentStatus.UnderMaintenance ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        }`}>
                        {item.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center space-x-2 text-sm font-medium ${riskInfo.textColor}`}>
                            <riskInfo.Icon className="w-5 h-5" />
                            <span>{riskInfo.label}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.nextServiceDate.toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => onSelectEquipment(item.id)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200">View</button>
                    </td>
                    </tr>
                );
                })}
            </tbody>
            </table>
            {sortedAndFilteredEquipment.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Equipment Found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
                    <button onClick={clearFilters} className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};