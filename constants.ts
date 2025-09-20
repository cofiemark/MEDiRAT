import React from 'react';
import { RiskLevel } from './types';
import { ShieldCheckIcon } from './components/icons/ShieldCheckIcon';
import { ShieldExclamationIcon } from './components/icons/ShieldExclamationIcon';
import { HeartbeatAlertIcon } from './components/icons/HeartbeatAlertIcon';

interface RiskLevelInfo {
  label: RiskLevel;
  range: string;
  action: string;
  color: string;
  textColor: string;
  borderColor: string;
  Icon: React.FC<{className?: string}>;
}

export const RISK_LEVELS: Record<RiskLevel, RiskLevelInfo> = {
  [RiskLevel.Negligible]: {
    label: RiskLevel.Negligible,
    range: '1-10',
    action: 'No action required; routine monitoring only',
    color: 'bg-green-100 dark:bg-green-900/50',
    textColor: 'text-green-800 dark:text-green-300',
    borderColor: 'border-green-500',
    Icon: ShieldCheckIcon,
  },
  [RiskLevel.Low]: {
    label: RiskLevel.Low,
    range: '11-30',
    action: 'Acceptable, but schedule regular preventive maintenance',
    color: 'bg-blue-100 dark:bg-blue-900/50',
    textColor: 'text-blue-800 dark:text-blue-300',
    borderColor: 'border-blue-500',
    Icon: ShieldCheckIcon,
  },
  [RiskLevel.Moderate]: {
    label: RiskLevel.Moderate,
    range: '31-50',
    action: 'Review and consider mitigation (e.g., software updates, minor servicing)',
    color: 'bg-yellow-100 dark:bg-yellow-900/50',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    borderColor: 'border-yellow-500',
    Icon: ShieldExclamationIcon,
  },
  [RiskLevel.High]: {
    label: RiskLevel.High,
    range: '51-75',
    action: 'Requires corrective maintenance: prioritize for scheduled maintenance',
    color: 'bg-orange-100 dark:bg-orange-900/50',
    textColor: 'text-orange-800 dark:text-orange-300',
    borderColor: 'border-orange-500',
    Icon: HeartbeatAlertIcon,
  },
  [RiskLevel.Critical]: {
    label: RiskLevel.Critical,
    range: '76-100',
    action: 'Immediate intervention needed; possible equipment failure risk',
    color: 'bg-red-100 dark:bg-red-900/50',
    textColor: 'text-red-800 dark:text-red-300',
    borderColor: 'border-red-500',
    Icon: HeartbeatAlertIcon,
  },
  [RiskLevel.Severe]: {
    label: RiskLevel.Severe,
    range: '>100',
    action: 'Urgent action required; equipment may need immediate repair, decommissioning, or replacement',
    color: 'bg-purple-100 dark:bg-purple-900/50',
    textColor: 'text-purple-800 dark:text-purple-300',
    borderColor: 'border-purple-500',
    Icon: HeartbeatAlertIcon,
  },
};

export const getRiskLevelFromRPN = (rpn: number): RiskLevel => {
  if (rpn <= 10) return RiskLevel.Negligible;
  if (rpn <= 30) return RiskLevel.Low;
  if (rpn <= 50) return RiskLevel.Moderate;
  if (rpn <= 75) return RiskLevel.High;
  if (rpn <= 100) return RiskLevel.Critical;
  return RiskLevel.Severe;
};