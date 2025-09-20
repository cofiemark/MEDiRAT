import type { ComponentType } from 'react';

export enum Department {
  ICU = 'Intensive Care Unit',
  Emergency = 'Emergency Department',
  Radiology = 'Radiology',
  Dental = 'Dental Clinic',
  ObstetricsGynecology = 'Obstetrics & Gynecology',
  SurgicalWard = 'Surgical Ward',
  MedicalWard = 'Medical Ward',
  Laboratory = 'Laboratory',
  PediatricWard = 'Pediatric Ward',
  OperationRoom = 'Operation Room',
  OPD = 'Outpatient Department',
  DialysisUnit = 'Dialysis Unit',
  MaternityWard = 'Maternity Ward',
  NICU = 'Neonatal Intensive Care Unit',
  Physiotherapy = 'Physiotherapy',
}

export enum EquipmentStatus {
  Operational = 'Operational',
  NeedsMaintenance = 'Needs Maintenance',
  UnderMaintenance = 'Under Maintenance',
  OutOfService = 'Out of Service',
}

export enum RiskLevel {
  Negligible = 'Negligible',
  Low = 'Low',
  Moderate = 'Moderate',
  High = 'High',
  Critical = 'Critical',
  Severe = 'Severe',
}

export interface MaintenanceLog {
  id: string;
  date: Date;
  technician: string;
  workPerformed: string;
  partsUsed: string[];
  notes: string;
  status: EquipmentStatus;
}

export interface RiskAssessment {
  likelihood: number;
  severity: number;
  detectability: number;
  rpn: number;
  riskLevel: RiskLevel;
  actionRequired: string;
  assessmentDate: Date;
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  department: Department;
  location: string;
  purchaseDate: Date;
  installationDate: Date;
  manufacturer: string;
  status: EquipmentStatus;
  inventoryCode: string;
  maintenanceHistory: MaintenanceLog[];
  riskAssessments: RiskAssessment[];
  maintenanceIntervalDays: number;
}

export interface AppNotification {
  id: string;
  equipmentId: string;
  equipmentName: string;
  department: Department;
  location: string;
  nextServiceDate: Date;
}

export type DashboardFilter = 'overdue' | 'upcoming' | 'highRisk' | 'operational';

export enum UserRole {
  ServiceManager = 'Service Manager',
  Technician = 'Technician',
  HospitalStaff = 'Hospital Staff'
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  avatarUrl: string;
}

export interface RiskLevelInfo {
  label: RiskLevel;
  range: string;
  action: string;
  color: string;
  textColor: string;
  borderColor: string;
  Icon: ComponentType<{className?: string}>;
}

export interface ChecklistItem {
  id: string;
  name: string;
  description: string;
  baseSeverity: number;
}

export interface AssessmentChecklist {
  model: string;
  items: ChecklistItem[];
}
