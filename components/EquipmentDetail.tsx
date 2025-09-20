import React, { useState } from 'react';
import type { EquipmentWithNextService } from '../App';
import { RISK_LEVELS, getRiskLevelFromRPN } from '../constants';
import { RiskLevel, EquipmentStatus } from '../types';
import { ServiceLogTable } from './ServiceLogTable';
import { RiskAssessmentForm } from './RiskAssessmentForm';
import { generateServiceNotes, generateReportSummary } from '../services/geminiService';
import { generatePdfReport } from '../services/pdfReportService';
import { SparklesIcon } from './icons/SparklesIcon';
import { TagIcon } from './icons/TagIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { DocumentArrowDownIcon } from './icons/DocumentArrowDownIcon';
import { RiskAssessmentHistory } from './RiskAssessmentHistory';


interface EquipmentDetailProps {
  equipment: EquipmentWithNextService;
}

export const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ equipment }) => {
    const [aiNotes, setAiNotes] = useState('');
    const [keywords, setKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const latestAssessment = equipment.riskAssessments.length > 0
        ? [...equipment.riskAssessments].sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0]
        : null;
    const riskLevel = latestAssessment ? getRiskLevelFromRPN(latestAssessment.rpn) : RiskLevel.Negligible;
    const riskInfo = RISK_LEVELS[riskLevel];

    const handleGenerateNotes = async () => {
        if (!keywords.trim()) {
            setAiNotes('Please enter some keywords to generate notes.');
            return;
        }
        setIsGenerating(true);
        setAiNotes('');
        try {
            const notes = await generateServiceNotes(keywords);
            setAiNotes(notes);
        } catch (error) {
            console.error("Failed to generate AI notes:", error);
            setAiNotes('An error occurred while generating notes. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        try {
            const aiSummary = await generateReportSummary(equipment);
            await generatePdfReport(equipment, latestAssessment, aiSummary);
        } catch(error) {
            console.error("Failed to generate PDF report:", error);
            alert("Could not generate the PDF report. Please check the console for errors.");
        } finally {
            setIsGeneratingReport(false);
        }
    }

    return (
        <div className="space-y-8">
            <header className="pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{equipment.name}</h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400">{equipment.model} (SN: {equipment.serialNumber})</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                          onClick={handleGenerateReport}
                          disabled={isGeneratingReport}
                          className="flex items-center space-x-2 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Generate PDF Report"
                        >
                          <DocumentArrowDownIcon className="w-5 h-5" />
                          <span>{isGeneratingReport ? 'Generating...' : 'PDF Report'}</span>
                        </button>
                        <div className={`p-2 rounded-lg flex items-center space-x-3 ${riskInfo.color}`}>
                            <riskInfo.Icon className={`w-8 h-8 ${riskInfo.textColor}`} />
                            <div>
                                <p className={`text-sm font-semibold ${riskInfo.textColor}`}>Current Risk</p>
                                <p className={`text-lg font-bold ${riskInfo.textColor}`}>{riskInfo.label}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Past Risk Assessments */}
                    <RiskAssessmentHistory assessments={equipment.riskAssessments} />

                    {/* Service Log Section */}
                    <ServiceLogTable maintenanceHistory={equipment.maintenanceHistory} equipmentName={equipment.name}/>

                    {/* AI Service Note Generator */}
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                            <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500"/>
                            AI Service Note Generator
                        </h3>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Enter keywords from a service (e.g., "replaced filter, calibrated sensor, system test pass") and let AI generate a professional log entry.</p>
                            <textarea
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="Enter keywords here..."
                                className="w-full p-2.5 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={3}
                            />
                            <button onClick={handleGenerateNotes} disabled={isGenerating} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {isGenerating ? 'Generating...' : 'Generate Notes'}
                            </button>
                            {aiNotes && (
                                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Generated Note:</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{aiNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Risk Assessment Form */}
                    <RiskAssessmentForm equipmentId={equipment.id} />
                </div>

                {/* Details Sidebar */}
                <aside className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700 text-gray-800 dark:text-gray-100">Details</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center"><TagIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500"/><strong>Status:</strong><span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                                equipment.status === EquipmentStatus.Operational ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                                equipment.status === EquipmentStatus.NeedsMaintenance ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                            }`}>{equipment.status}</span></li>
                            <li className="flex items-center"><BuildingOfficeIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500"/><strong>Department:</strong><span className="ml-2 text-gray-600 dark:text-gray-300">{equipment.department}</span></li>
                             <li className="flex items-center"><CpuChipIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500"/><strong>Manufacturer:</strong><span className="ml-2 text-gray-600 dark:text-gray-300">{equipment.manufacturer}</span></li>
                            <li className="flex items-center"><CalendarDaysIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500"/><strong>Installed:</strong><span className="ml-2 text-gray-600 dark:text-gray-300">{equipment.installationDate.toLocaleDateString()}</span></li>
                            <li className="flex items-center"><WrenchScrewdriverIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500"/><strong>Next Service:</strong><span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">{equipment.nextServiceDate.toLocaleDateString()}</span></li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};