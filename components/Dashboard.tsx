import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EquipmentWithNextService } from '../App';
import { Department, EquipmentStatus, DashboardFilter, RiskLevel } from '../types';
import { getRiskLevelFromRPN, RISK_LEVELS } from '../constants';
import { HeartbeatAlertIcon } from './icons/HeartbeatAlertIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface DashboardProps {
    equipment: EquipmentWithNextService[];
    onSelectEquipment: (id: string) => void;
    onCardClick: (filter: DashboardFilter) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; color: string; onClick: () => void; icon?: React.ReactNode }> = ({ title, value, color, onClick, icon }) => (
    <button onClick={onClick} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-left w-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
        <div className="flex items-center space-x-2">
            {icon}
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        </div>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ equipment, onSelectEquipment, onCardClick }) => {
    const stats = useMemo(() => {
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        const overdue = equipment.filter(e => e.status === EquipmentStatus.NeedsMaintenance || e.status === EquipmentStatus.OutOfService).length;
        const highRisk = equipment.filter(e => {
            if (e.riskAssessments.length === 0) return false;
            const latestRpn = e.riskAssessments.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0].rpn;
            const riskLevel = getRiskLevelFromRPN(latestRpn);
            return ['High', 'Critical', 'Severe'].includes(riskLevel);
        }).length;
        const operational = equipment.filter(e => e.status === EquipmentStatus.Operational).length;
        const upcoming = equipment.filter(e => e.nextServiceDate > now && e.nextServiceDate <= thirtyDaysFromNow).length;

        return { overdue, highRisk, operational, upcoming };
    }, [equipment]);

    const departmentData = useMemo(() => {
        const counts: { [key in Department]?: number } = {};
        for (const item of equipment) {
            counts[item.department] = (counts[item.department] || 0) + 1;
        }
        return Object.entries(counts).map(([name, value]) => ({ name: name.split(' ')[0], value }));
    }, [equipment]);

    const upcomingMaintenance = useMemo(() => {
        const now = new Date();
        return equipment
            .filter(e => e.nextServiceDate > now)
            .sort((a, b) => a.nextServiceDate.getTime() - b.nextServiceDate.getTime())
            .slice(0, 5);
    }, [equipment]);


    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Services Overdue" 
                    value={stats.overdue} 
                    color="text-red-500" 
                    onClick={() => onCardClick('overdue')} 
                    icon={<ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
                />
                <StatCard 
                    title="Upcoming Services (30d)" 
                    value={stats.upcoming} 
                    color="text-blue-500" 
                    onClick={() => onCardClick('upcoming')} 
                    icon={<CalendarDaysIcon className="h-5 w-5 text-blue-500" />}
                />
                <StatCard 
                  title="High-Risk Equipment" 
                  value={stats.highRisk} 
                  color="text-orange-500" 
                  onClick={() => onCardClick('highRisk')} 
                  icon={<HeartbeatAlertIcon className="h-5 w-5 text-orange-500" />}
                />
                <StatCard 
                    title="Fully Operational" 
                    value={stats.operational} 
                    color="text-green-500" 
                    onClick={() => onCardClick('operational')} 
                    icon={<ShieldCheckIcon className="h-5 w-5 text-green-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Upcoming Maintenance</h3>
                    <div className="space-y-4">
                        {upcomingMaintenance.map(item => {
                            const latestAssessment = item.riskAssessments.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
                            const riskLevel = latestAssessment ? getRiskLevelFromRPN(latestAssessment.rpn) : RiskLevel.Negligible;
                            const riskInfo = RISK_LEVELS[riskLevel];
                          return (
                            <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.department}</p>
                                    <div className="flex items-center space-x-1 mt-1">
                                        <riskInfo.Icon className={`w-4 h-4 ${riskInfo.textColor}`} />
                                        <span className={`text-xs font-medium ${riskInfo.textColor}`}>{riskInfo.label} Risk</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.nextServiceDate.toLocaleDateString()}</p>
                                    <button onClick={() => onSelectEquipment(item.id)} className="mt-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View</button>
                                </div>
                            </div>
                         )
                        })}
                        {upcomingMaintenance.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-8">No upcoming maintenance scheduled.</p>}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Equipment by Department</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={departmentData}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                            <YAxis tick={{ fill: '#9ca3af' }}/>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }} />
                            <Legend wrapperStyle={{ color: '#9ca3af' }} />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} name="Equipment Count" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
