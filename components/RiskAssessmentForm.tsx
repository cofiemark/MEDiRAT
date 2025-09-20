import React, { useState, useMemo } from 'react';
import { getRiskLevelFromRPN, RISK_LEVELS } from '../constants';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface RiskAssessmentFormProps {
  equipmentId: string;
}

const SliderInput: React.FC<{
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="flex items-center space-x-4 mt-1">
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
      />
      <span className="font-bold text-indigo-600 dark:text-indigo-400 w-8 text-center">{value}</span>
    </div>
  </div>
);

export const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({ equipmentId }) => {
  const [likelihood, setLikelihood] = useState(1);
  const [severity, setSeverity] = useState(1);
  const [detectability, setDetectability] = useState(1);
  const [actionRequired, setActionRequired] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { rpn, riskLevel, riskInfo } = useMemo(() => {
    const calculatedRpn = likelihood * severity * detectability;
    const level = getRiskLevelFromRPN(calculatedRpn);
    return {
      rpn: calculatedRpn,
      riskLevel: level,
      riskInfo: RISK_LEVELS[level],
    };
  }, [likelihood, severity, detectability]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionRequired.trim()) {
      alert('Please describe the action required.');
      return;
    }
    const newAssessment = {
      id: `assess-${equipmentId}-${Date.now()}`,
      equipmentId,
      likelihood,
      severity,
      detectability,
      rpn,
      riskLevel,
      actionRequired,
      assessmentDate: new Date(),
    };
    console.log("New Risk Assessment Submitted:", newAssessment);
    // In a real application, you would lift this state up or send it to an API.
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setLikelihood(1);
    setSeverity(1);
    setDetectability(1);
    setActionRequired('');
    setIsSubmitted(false);
  }

  if (isSubmitted) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Assessment Submitted</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The risk assessment has been logged successfully.</p>
        <button
          onClick={handleReset}
          className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Another Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Submit New Risk Assessment</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SliderInput label="Likelihood (1-5)" value={likelihood} onChange={(e) => setLikelihood(Number(e.target.value))} />
          <SliderInput label="Severity (1-5)" value={severity} onChange={(e) => setSeverity(Number(e.target.value))} />
          <SliderInput label="Detectability (1-5)" value={detectability} onChange={(e) => setDetectability(Number(e.target.value))} />
        </div>

        <div className={`p-4 rounded-lg flex items-center justify-between ${riskInfo.color}`}>
            <div className="flex items-center space-x-3">
                <riskInfo.Icon className={`w-8 h-8 ${riskInfo.textColor}`} />
                <div>
                    <p className={`text-sm font-semibold ${riskInfo.textColor}`}>Calculated Risk</p>
                    <p className={`text-lg font-bold ${riskInfo.textColor}`}>{riskInfo.label}</p>
                </div>
            </div>
            <div>
                <p className={`text-sm font-semibold text-right ${riskInfo.textColor}`}>RPN</p>
                <p className={`text-2xl font-bold text-right ${riskInfo.textColor}`}>{rpn}</p>
            </div>
        </div>

        <div>
          <label htmlFor="actionRequired" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action Required</label>
          <textarea
            id="actionRequired"
            value={actionRequired}
            onChange={(e) => setActionRequired(e.target.value)}
            placeholder="e.g., Immediate inspection of power supply unit."
            className="mt-1 w-full p-2.5 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit Assessment
          </button>
        </div>
      </form>
    </div>
  );
};