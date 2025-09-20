import React, { useState, useMemo } from 'react';
import type { EquipmentWithNextService } from '../App';
import { Department, RiskAssessment, RiskLevel, EquipmentStatus } from '../types';
import { MOCK_CHECKLISTS } from '../services/mockData';
import { getRiskLevelFromRPN, RISK_LEVELS } from '../constants';
import type { ChecklistItem } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ConfirmationDialog } from './ConfirmationDialog';

interface AssessmentFormProps {
    allEquipment: EquipmentWithNextService[];
    onAssessmentSubmit: (equipmentId: string, newAssessment: Omit<RiskAssessment, 'assessmentDate'>, newStatus: EquipmentStatus) => void;
}

interface Score {
    severity: number;
    likelihood: number;
    detectability: number;
}

// Scoring criteria from the document
const LIKELIHOOD_OPTIONS: Record<number, string> = {
    0: 'Almost impossible; no known failures',
    1: 'Rare failure (very low occurrence)',
    2: 'Occasional failure (happens regularly)',
    3: 'Moderate occurrence (happens regularly)',
    4: 'Frequent failures (happens often)',
    5: 'Very frequent (high chance of failure)',
};

const SEVERITY_OPTIONS: Record<number, string> = {
    1: 'No real effect, minor inconvenience',
    2: 'Low impact, minor delays or discomfort',
    3: 'Moderate impact, may affect patient care but not critical',
    4: 'High impact, serious patient risk or system failure',
    5: 'Critical impact, life-threatening or total equipment failure',
};

const DETECTABILITY_OPTIONS: Record<number, string> = {
    1: 'Highly detectable, obvious failure',
    2: 'Detectable through standard checks',
    3: 'Difficulty to detect, may need special checks',
    4: 'Very hard to detect, requires extensive testing',
};

const getStatusFromRiskLevel = (riskLevel: RiskLevel): EquipmentStatus => {
  switch (riskLevel) {
    case RiskLevel.Negligible:
    case RiskLevel.Low:
      return EquipmentStatus.Operational;
    case RiskLevel.Moderate:
    case RiskLevel.High:
    case RiskLevel.Critical:
      return EquipmentStatus.NeedsMaintenance;
    case RiskLevel.Severe:
      return EquipmentStatus.OutOfService;
    default:
      return EquipmentStatus.Operational;
  }
};

const ScoreSlider: React.FC<{
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  options: Record<number, string>;
  disabled: boolean;
}> = ({ label, value, onChange, min, max, options, disabled }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center space-x-4 mt-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600 disabled:opacity-50"
          aria-label={`${label} score`}
        />
        <span className="font-bold text-indigo-600 dark:text-indigo-400 w-8 text-center" aria-live="polite">{value}</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 h-8">{options[value] || ''}</p>
    </div>
  );
};


export const AssessmentForm: React.FC<AssessmentFormProps> = ({ allEquipment, onAssessmentSubmit }) => {
    const [selectedDept, setSelectedDept] = useState<Department | ''>('');
    const [selectedEquipId, setSelectedEquipId] = useState<string>('');
    const [scores, setScores] = useState<Record<string, Score>>({});
    const [notes, setNotes] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const equipmentInDept = useMemo(() => {
        if (!selectedDept) return [];
        return allEquipment.filter(eq => eq.department === selectedDept);
    }, [selectedDept, allEquipment]);

    const selectedEquipment = useMemo(() => {
        if (!selectedEquipId) return null;
        return allEquipment.find(eq => eq.id === selectedEquipId);
    }, [selectedEquipId, allEquipment]);

    const checklist = useMemo(() => {
        if (!selectedEquipment) return null;
        return MOCK_CHECKLISTS.find(cl => cl.model === selectedEquipment.model) || null;
    }, [selectedEquipment]);

    const { averageScores, totalRpn, riskLevelInfo, riskBadge } = useMemo(() => {
        if (!checklist) {
            const defaultRisk = getRiskLevelFromRPN(0);
            return {
                averageScores: { likelihood: 0, severity: 0, detectability: 0 },
                totalRpn: 0,
                riskLevelInfo: defaultRisk,
                riskBadge: RISK_LEVELS[defaultRisk],
            };
        }

        const numItems = checklist.items.length || 1;
        let totalLikelihood = 0;
        let totalSeverity = 0;
        let totalDetectability = 0;

        checklist.items.forEach(item => {
            const currentScores = scores[item.id];
            
            const severity = currentScores?.severity ?? item.baseSeverity;
            const likelihood = currentScores?.likelihood ?? 0;
            const detectability = currentScores?.detectability ?? 1;
            
            totalLikelihood += likelihood;
            totalSeverity += severity;
            totalDetectability += detectability;
        });

        const averages = {
            likelihood: totalLikelihood / numItems,
            severity: totalSeverity / numItems,
            detectability: totalDetectability / numItems,
        };

        const calculatedTotalRpn = averages.likelihood * averages.severity * averages.detectability;
        const finalRiskLevel = getRiskLevelFromRPN(calculatedTotalRpn);

        return {
            averageScores: averages,
            totalRpn: Math.round(calculatedTotalRpn),
            riskLevelInfo: finalRiskLevel,
            riskBadge: RISK_LEVELS[finalRiskLevel],
        };
    }, [scores, checklist]);

    const handleScoreChange = (itemId: string, field: keyof Score, value: number) => {
        setScores(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value
            }
        }));
    };
    
    const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDept(e.target.value as Department);
        setSelectedEquipId('');
        setScores({});
    };
    
    const handleEquipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setSelectedEquipId(newId);

        const equipmentModel = allEquipment.find(eq => eq.id === newId)?.model;
        const newChecklist = MOCK_CHECKLISTS.find(cl => cl.model === equipmentModel);

        if (newChecklist) {
            const initialChecklistScores = Object.fromEntries(
                newChecklist.items.map(item => [
                    item.id,
                    {
                        severity: item.baseSeverity,
                        likelihood: 0, // Default likelihood to 0
                        detectability: 1, // Default detectability to 1
                    },
                ])
            );
            setScores(initialChecklistScores);
        } else {
            setScores({});
        }
    };

    const handleInitiateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEquipId || !checklist) return;
        setIsConfirmDialogOpen(true);
    };
    
    const handleConfirmSubmit = () => {
        if (!selectedEquipId) return;

        const newAssessment: Omit<RiskAssessment, 'assessmentDate'> = {
            likelihood: Math.round(averageScores.likelihood),
            severity: Math.round(averageScores.severity),
            detectability: Math.round(averageScores.detectability),
            rpn: totalRpn,
            riskLevel: riskLevelInfo,
            actionRequired: riskBadge.action,
        };

        const newStatus = getStatusFromRiskLevel(riskLevelInfo);
        
        onAssessmentSubmit(selectedEquipId, newAssessment, newStatus);
        setIsSubmitted(true);
        setIsConfirmDialogOpen(false);
    };
    
    const handleNewAssessment = () => {
        setIsSubmitted(false);
        setSelectedDept('');
        setSelectedEquipId('');
        setScores({});
        setNotes('');
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
             <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Assessment Form</h2>
             <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <form onSubmit={handleInitiateSubmit} className="space-y-6">
                    {/* --- Selection Header --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Department</label>
                            <select
                                value={selectedDept}
                                onChange={handleDeptChange}
                                disabled={isSubmitted}
                                className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Choose Department --</option>
                                {Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Equipment</label>
                            <select
                                value={selectedEquipId}
                                onChange={handleEquipChange}
                                disabled={!selectedDept || isSubmitted}
                                className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
                            >
                                <option value="">-- Choose Equipment --</option>
                                {equipmentInDept.map(eq => <option key={eq.id} value={eq.id}>{eq.name} ({eq.inventoryCode})</option>)}
                            </select>
                        </div>
                    </div>

                    {selectedEquipment && !isSubmitted && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
                           <p><strong>Model:</strong> {selectedEquipment.model}</p>
                           <p><strong>Location:</strong> {selectedEquipment.location}</p>
                           <p><strong>Status:</strong> {selectedEquipment.status}</p>
                        </div>
                    )}

                    {/* --- Checklist --- */}
                    {!isSubmitted && checklist && (
                         <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                             <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Checklist</h3>
                             {checklist.items.map(item => {
                                const scoreForItem = scores[item.id] ?? { severity: item.baseSeverity, likelihood: 0, detectability: 1 };
                                return (
                                 <div key={item.id} className="p-4 border dark:border-gray-600 rounded-lg space-y-4">
                                     <div>
                                         <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                         <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">Status Check:</span> {item.description}
                                         </p>
                                          <p className="text-xs text-gray-500 dark:text-gray-500">Base Severity: {item.baseSeverity} • ID: {item.id}</p>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <ScoreSlider
                                            label="Severity"
                                            value={scoreForItem.severity}
                                            onChange={(e) => handleScoreChange(item.id, 'severity', Number(e.target.value))}
                                            min={1} max={5}
                                            options={SEVERITY_OPTIONS}
                                            disabled={isSubmitted}
                                        />
                                        <ScoreSlider
                                            label="Likelihood"
                                            value={scoreForItem.likelihood}
                                            onChange={(e) => handleScoreChange(item.id, 'likelihood', Number(e.target.value))}
                                            min={0} max={5}
                                            options={LIKELIHOOD_OPTIONS}
                                            disabled={isSubmitted}
                                        />
                                        <ScoreSlider
                                            label="Detectability"
                                            value={scoreForItem.detectability}
                                            onChange={(e) => handleScoreChange(item.id, 'detectability', Number(e.target.value))}
                                            min={1} max={4}
                                            options={DETECTABILITY_OPTIONS}
                                            disabled={isSubmitted}
                                        />
                                     </div>
                                 </div>
                                )
                             })}
                         </div>
                    )}
                    
                    {!isSubmitted && !checklist && selectedEquipId && (
                        <div className="text-center py-8 border-t dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">No assessment checklist is available for this equipment model.</p>
                        </div>
                    )}

                    {/* --- Scoring Summary --- */}
                    {!isSubmitted && checklist && (
                        <div className="pt-6 border-t dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Scoring Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">Average Scores</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Average Likelihood:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{averageScores.likelihood.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Average Severity:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{averageScores.severity.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Average Detectability:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{averageScores.detectability.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-lg flex items-center justify-between ${riskBadge.color}`}>
                                    <div className="flex items-center space-x-3">
                                        <riskBadge.Icon className={`w-8 h-8 ${riskBadge.textColor}`} />
                                        <div>
                                            <p className={`text-sm font-semibold ${riskBadge.textColor}`}>Final Risk Level</p>
                                            <p className={`text-lg font-bold ${riskBadge.textColor}`}>{riskBadge.label}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className={`text-sm font-semibold text-right ${riskBadge.textColor}`}>Total RPN</p>
                                        <p className={`text-2xl font-bold text-right ${riskBadge.textColor}`}>{totalRpn}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- Notes --- */}
                    {!isSubmitted && (
                        <div className="pt-4">
                            <label htmlFor="notes" className="block text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">General Assessment Notes</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                disabled={isSubmitted}
                                placeholder="Notes, observations..."
                                rows={4}
                                className="w-full p-2.5 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    )}
                    
                    {/* --- Submission --- */}
                    <div className="pt-6 border-t dark:border-gray-700">
                        {isSubmitted ? (
                            <div className="w-full p-6 rounded-md bg-green-100 dark:bg-green-900/50 text-center">
                                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-green-800 dark:text-green-100">Assessment Submitted Successfully</h3>
                                
                                <div className="mt-4 text-left p-4 bg-green-50 dark:bg-green-800/50 rounded-lg space-y-2">
                                    <p className="text-sm text-green-800 dark:text-green-200">
                                        <strong>Total RPN Score:</strong> {totalRpn}
                                    </p>
                                    <p className={`flex items-center gap-2 text-sm text-green-800 dark:text-green-200`}>
                                        <strong>Risk Level:</strong> 
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${riskBadge.textColor} ${riskBadge.color}`}>
                                            {riskBadge.label}
                                        </span>
                                    </p>
                                    <p className="text-sm text-green-800 dark:text-green-200">
                                        <span className="font-semibold">Action Required:</span> {riskBadge.action}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNewAssessment}
                                    className="mt-6 px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Submit Another Assessment
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!selectedEquipId || !checklist}
                                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    Submit Assessment
                                </button>
                            </div>
                        )}
                    </div>

                </form>
             </div>
             <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                title="Confirm Assessment Submission"
                message={`Please confirm you want to submit this assessment for "${selectedEquipment?.name || 'this equipment'}". The calculated RPN is ${totalRpn}, resulting in a "${riskBadge.label}" risk level.`}
                onConfirm={handleConfirmSubmit}
                onCancel={() => setIsConfirmDialogOpen(false)}
                confirmText="Submit"
                confirmButtonClass="bg-green-600 hover:bg-green-700 focus:ring-green-500"
            />
        </div>
    );
};