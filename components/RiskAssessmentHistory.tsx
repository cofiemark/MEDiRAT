import React, { useState } from 'react';
import type { RiskAssessment } from '../types';
import { RISK_LEVELS } from '../constants';
import { ChevronDownIcon, ChevronUpIcon } from './icons/ChevronIcons';
import { ChartBarIcon } from './icons/ChartBarIcon';

interface RiskAssessmentHistoryProps {
  assessments: RiskAssessment[];
}

export const RiskAssessmentHistory: React.FC<RiskAssessmentHistoryProps> = ({ assessments }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortedAssessments = [...assessments].sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime());
  // We display past assessments, so we slice after the first (latest) one.
  const pastAssessments = sortedAssessments.slice(1);

  if (pastAssessments.length === 0) {
    return null; // Don't render the component if there's no history to show
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left focus:outline-none"
        aria-expanded={isOpen}
        aria-controls="assessment-history-panel"
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <ChartBarIcon className="w-6 h-6 mr-2 text-gray-500" />
          Past Risk Assessments ({pastAssessments.length})
        </h3>
        {isOpen ? <ChevronUpIcon className="w-6 h-6 text-gray-500" /> : <ChevronDownIcon className="w-6 h-6 text-gray-500" />}
      </button>

      {isOpen && (
        <div id="assessment-history-panel" className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">RPN</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Risk Level</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action Required</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pastAssessments.map((assessment, index) => {
                const riskInfo = RISK_LEVELS[assessment.riskLevel];
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{assessment.assessmentDate.toLocaleDateString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{assessment.rpn}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-2 px-2 py-1 text-xs font-semibold rounded-full ${riskInfo.color} ${riskInfo.textColor}`}>
                          <riskInfo.Icon className="w-4 h-4" />
                          <span>{riskInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 break-words max-w-xs">{assessment.actionRequired}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};