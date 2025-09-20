import { Department, EquipmentStatus, RiskLevel } from '../types';
import type { Equipment, AssessmentChecklist } from '../types';

const today = new Date();
const daysAgo = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

// This function calculates a last service date so that the next service is due in ~2.5 hours
const createUrgentServiceDate = (maintenanceIntervalDays: number): Date => {
  const urgentServiceDueDate = new Date();
  urgentServiceDueDate.setHours(urgentServiceDueDate.getHours() + 2, urgentServiceDueDate.getMinutes() + 30); // 2.5 hours from now

  const lastServiceDate = new Date(urgentServiceDueDate);
  lastServiceDate.setDate(lastServiceDate.getDate() - maintenanceIntervalDays);
  return lastServiceDate;
}

export const MOCK_CHECKLISTS: AssessmentChecklist[] = [
  // OPD (OUTPATIENT DEPARTMENT)
  {
    model: 'ExamTable-100', // Examination Table
    items: [
      { id: 'cl-et100-1', name: 'Height adjustment', description: 'Ensure smooth operation check', baseSeverity: 3 },
      { id: 'cl-et100-2', name: 'Frame integrity', description: 'Inspect for cracks, dent or instability', baseSeverity: 4 },
      { id: 'cl-et100-3', name: 'Upholstery', description: 'Check for tears or material wear', baseSeverity: 2 },
      { id: 'cl-et100-4', name: 'Power source', description: 'Inspect connection and wiring', baseSeverity: 3 },
    ]
  },
  {
    model: 'CuffCheck Basic', // Blood Pressure Monitor
    items: [
      { id: 'cl-ccb-1', name: 'Cuff', description: 'Check for leaks or wear', baseSeverity: 3 },
      { id: 'cl-ccb-2', name: 'Pressure Sensor', description: 'Ensure proper calibration', baseSeverity: 4 },
      { id: 'cl-ccb-3', name: 'Display Screen', description: 'Test for visibility and responsiveness', baseSeverity: 2 },
      { id: 'cl-ccb-4', name: 'Power Source', description: 'Check battery or power adapter functionality', baseSeverity: 3 },
    ]
  },
  // LABORATORY DEPARTMENT
  {
    model: 'LabScope 5', // Microscope
    items: [
      { id: 'cl-ls5-1', name: 'Optical Lenses', description: 'Inspect for scratches and clarity', baseSeverity: 4 },
      { id: 'cl-ls5-2', name: 'Light Source', description: 'Check brightness and stability', baseSeverity: 3 },
      { id: 'cl-ls5-3', name: 'Stage Mechanism', description: 'Test smooth movement and alignment', baseSeverity: 2 },
      { id: 'cl-ls5-4', name: 'Power Source', description: 'Inspect cable and connections', baseSeverity: 3 },
    ]
  },
  {
    model: 'SpinMaster 5000', // Centrifuge
    items: [
      { id: 'cl-sm5000-1', name: 'Rotor', description: 'Check for balance and smooth rotation', baseSeverity: 4 },
      { id: 'cl-sm5000-2', name: 'Lid locking mechanism', description: 'Inspect for secure locking', baseSeverity: 3 },
      { id: 'cl-sm5000-3', name: 'Display panel', description: 'Test for functionality and readability', baseSeverity: 2 },
      { id: 'cl-sm5000-4', name: 'Power source', description: 'Verify stability and connection', baseSeverity: 3 },
    ]
  },
  {
    model: 'HemoCount 300', // Haematology Analyzer
    items: [
      { id: 'cl-hc3-1', name: 'Reagent Check', description: 'Check levels, expiry and functionality', baseSeverity: 5 },
      { id: 'cl-hc3-2', name: 'Optical Sensor', description: 'Inspect for cleanliness and calibration', baseSeverity: 4 },
      { id: 'cl-hc3-3', name: 'Waste Disposal System', description: 'Ensure proper disposal and no clogs', baseSeverity: 3 },
      { id: 'cl-hc3-4', name: 'Power Source', description: 'Inspect power cable and connection', baseSeverity: 4 },
    ]
  },
  {
    model: 'ChemScan Elite', // Chemistry Analyser
    items: [
      { id: 'cl-cse-1', name: 'Reagent System', description: 'Verify levels and expiry', baseSeverity: 5 },
      { id: 'cl-cse-2', name: 'Optical Sensor', description: 'Test calibration and cleanliness', baseSeverity: 4 },
      { id: 'cl-cse-3', name: 'Waste Disposal System', description: 'Check for proper functioning', baseSeverity: 3 },
      { id: 'cl-cse-4', name: 'Power Source', description: 'Check for proper functioning', baseSeverity: 4 },
    ]
  },
  // EMERGENCY DEPARTMENT / ICU
  {
    model: 'Respira Pro X', // Ventilator
    items: [
      { id: 'cl-rpx-1', name: 'Oxygen Flow System', description: 'Ensure consistent oxygen delivery', baseSeverity: 5 },
      { id: 'cl-rpx-2', name: 'Alarms', description: 'Test functionality and alert accuracy', baseSeverity: 5 },
      { id: 'cl-rpx-3', name: 'Tubing', description: 'Inspect for leaks and blockages', baseSeverity: 4 },
      { id: 'cl-rpx-4', name: 'Power Source', description: 'Verify stable connection', baseSeverity: 4 },
    ]
  },
  {
    model: 'CardioShock 500', // Defibrillator
    items: [
        { id: 'cl-cs500-1', name: 'Battery', description: 'Ensure charge level and readiness', baseSeverity: 5 },
        { id: 'cl-cs500-2', name: 'Shock Pads', description: 'Inspect for proper connection and expiry', baseSeverity: 5 },
        { id: 'cl-cs500-3', name: 'Display Screen', description: 'Check visibility and responsiveness', baseSeverity: 3 },
        { id: 'cl-cs500-4', name: 'Power Source', description: 'Verify power supply stability', baseSeverity: 4 },
    ]
  },
  // RADIOLOGY DEPARTMENT
  {
    model: 'ImageX 3000', // X-ray Machine
    items: [
      { id: 'cl-ix3000-1', name: 'X-ray Tube', description: 'Inspect for overheating and output consistency', baseSeverity: 5 },
      { id: 'cl-ix3000-2', name: 'Collimator', description: 'Ensure correct beam alignment', baseSeverity: 4 },
      { id: 'cl-ix3000-3', name: 'Image Receptor', description: 'Test clarity of captured images', baseSeverity: 4 },
      { id: 'cl-ix3000-4', name: 'Power Source', description: 'Verify stability and electrical wiring', baseSeverity: 3 },
    ]
  },
  {
    model: 'Magneton Spectra', // MRI Machine
    items: [
      { id: 'cl-ms-1', name: 'Magnet Coils', description: 'Verify uniform magnetic field generation', baseSeverity: 5 },
      { id: 'cl-ms-2', name: 'RF Coils', description: 'Test signal clarity and strength', baseSeverity: 4 },
      { id: 'cl-ms-3', name: 'Cooling System', description: 'Ensure helium levels and function', baseSeverity: 5 },
      { id: 'cl-ms-4', name: 'Power Source', description: 'Inspect electrical stability', baseSeverity: 4 },
    ]
  },
  // DENTAL CLINIC
  {
    model: 'ComfortDent Pro', // Dental Chair
    items: [
      { id: 'cl-cdp-1', name: 'Hydraulic System', description: 'Test movement and stability', baseSeverity: 3 },
      { id: 'cl-cdp-2', name: 'Upholstery', description: 'Check for tears and wear', baseSeverity: 2 },
      { id: 'cl-cdp-3', name: 'Control Panel', description: 'Ensure all buttons function properly', baseSeverity: 2 },
      { id: 'cl-cdp-4', name: 'Power Source', description: 'Inspect wiring and electrical connections', baseSeverity: 3 },
    ]
  },
  {
    model: 'SteriPro 20L', // Autoclave
    items: [
      { id: 'cl-sp20-1', name: 'Sterilization Chamber', description: 'Inspect for leaks and functionality', baseSeverity: 5 },
      { id: 'cl-sp20-2', name: 'Pressure Gauge', description: 'Verify accuracy', baseSeverity: 4 },
      { id: 'cl-sp20-3', name: 'Heating Element', description: 'Ensure consistent temperature control', baseSeverity: 4 },
      { id: 'cl-sp20-4', name: 'Power Source', description: 'Inspect wiring and connection', baseSeverity: 3 },
    ]
  },
  // OPERATION ROOM
  {
    model: 'SomaSafe 9000', // Anesthesia Machine
    items: [
      { id: 'cl-ss9000-1', name: 'Oxygen Supply', description: 'Ensure proper flow and connection', baseSeverity: 5 },
      { id: 'cl-ss9000-2', name: 'Ventilation System', description: 'Verify correct pressure and volume delivery', baseSeverity: 5 },
      { id: 'cl-ss9000-3', name: 'Alarm System', description: 'Test for functionality and response', baseSeverity: 5 },
      { id: 'cl-ss9000-4', name: 'Power Source', description: 'Inspect for stable power supply', baseSeverity: 4 },
    ]
  },
  {
    model: 'LumaField Pro', // Surgical Light
    items: [
      { id: 'cl-lfp-1', name: 'Brightness Control', description: 'Verify adjustable illumination levels', baseSeverity: 3 },
      { id: 'cl-lfp-2', name: 'Positioning Arm', description: 'Ensure flexible movement and secure positioning', baseSeverity: 3 },
      { id: 'cl-lfp-3', name: 'Bulb Condition', description: 'Check for flickering or burnout', baseSeverity: 4 },
      { id: 'cl-lfp-4', name: 'Power Source', description: 'Inspect wiring and stability', baseSeverity: 3 },
    ]
  },
  // OBSTETRICS & GYNECOLOGY
  {
    model: 'SonoScan HD', // Ultrasound Machine
    items: [
      { id: 'cl-ssd-1', name: 'Transducer Probe', description: 'Inspect for cracks and clear signal output', baseSeverity: 5 },
      { id: 'cl-ssd-2', name: 'Display Screen', description: 'Ensure image clarity and responsiveness', baseSeverity: 3 },
      { id: 'cl-ssd-3', name: 'Control Panel', description: 'Check button and knob functionality', baseSeverity: 2 },
      { id: 'cl-ssd-4', name: 'Power Source', description: 'Verify stable power connection', baseSeverity: 4 },
    ]
  },
  // WARDS (SURGICAL, MEDICAL, PEDIATRIC)
  {
    model: 'VitalTrack 8', // Patient Monitor
    items: [
      { id: 'cl-vt8-1', name: 'ECG Module', description: 'Inspect signal clarity and lead connection', baseSeverity: 5 },
      { id: 'cl-vt8-2', name: 'SpO2 Sensor', description: 'Check light signal and accuracy', baseSeverity: 4 },
      { id: 'cl-vt8-3', name: 'Blood Pressure Module', description: 'Verify cuff and auto-inflate system', baseSeverity: 4 },
      { id: 'cl-vt8-4', name: 'Display Screen', description: 'Test clarity and responsiveness', baseSeverity: 2 },
      { id: 'cl-vt8-5', name: 'Power Source', description: 'Check for stable power supply or battery', baseSeverity: 4 },
    ]
  },
  {
    model: 'CardioGraph 12', // ECG Machine
    items: [
      { id: 'cl-cg12-1', name: 'Leads and Electrodes', description: 'Inspect for wear and signal clarity', baseSeverity: 4 },
      { id: 'cl-cg12-2', name: 'Display Screen', description: 'Ensure clear visibility of readings', baseSeverity: 2 },
      { id: 'cl-cg12-3', name: 'Control Panel', description: 'Test button functionality', baseSeverity: 3 },
      { id: 'cl-cg12-4', name: 'Power Source', description: 'Inspect cord and connection stability', baseSeverity: 3 },
    ]
  },
  {
    model: 'FluidFlow 300', // Infusion Pump
    items: [
      { id: 'cl-ff300-1', name: 'Pump Mechanism', description: 'Test flow rate accuracy', baseSeverity: 5 },
      { id: 'cl-ff300-2', name: 'Tubing & Connections', description: 'Check for leaks and proper attachment', baseSeverity: 4 },
      { id: 'cl-ff300-3', name: 'Alarm System', description: 'Ensure alert functionality for occlusions or errors', baseSeverity: 5 },
      { id: 'cl-ff300-4', name: 'Power Source', description: 'Inspect for stable power supply or battery backup', baseSeverity: 4 },
    ]
  },
  // PHYSIOTHERAPY
  {
    model: 'CardioRun 5K', // Treadmill
    items: [
      { id: 'cl-cr5k-1', name: 'Motor', description: 'Ensure smooth operation without noise', baseSeverity: 4 },
      { id: 'cl-cr5k-2', name: 'Belt', description: 'Inspect for wear and alignment', baseSeverity: 3 },
      { id: 'cl-cr5k-3', name: 'Control Panel', description: 'Test functionality of all buttons', baseSeverity: 2 },
      { id: 'cl-cr5k-4', name: 'Power Source', description: 'Inspect cable and connection stability', baseSeverity: 3 },
    ]
  },
  // DIALYSIS UNIT
  {
    model: 'PuraFlow 100', // Hemodialysis Machine
    items: [
      { id: 'cl-pf100-1', name: 'Filtration System', description: 'Ensure proper waste removal and ultrafiltration', baseSeverity: 5 },
      { id: 'cl-pf100-2', name: 'Dialysate Flow Rate', description: 'Verify correct concentration and flow speed', baseSeverity: 5 },
      { id: 'cl-pf100-3', name: 'Alarm & Safety', description: 'Check error alerts and emergency shutdown functionality', baseSeverity: 5 },
      { id: 'cl-pf100-4', name: 'Power Supply', description: 'Verify stable power connection', baseSeverity: 4 },
    ]
  },
  // MATERNITY WARD
  {
    model: 'BabyBeat 2', // Fetal Monitor
    items: [
      { id: 'cl-bb2-1', name: 'Probe Sensor', description: 'Check signal clarity and sensitivity', baseSeverity: 5 },
      { id: 'cl-bb2-2', name: 'Battery/Power Source', description: 'Verify charge level and cable condition', baseSeverity: 4 },
      { id: 'cl-bb2-3', name: 'Speaker', description: 'Ensure clear sound output', baseSeverity: 2 },
      { id: 'cl-bb2-4', name: 'Display', description: 'Verify clarity and response time', baseSeverity: 3 },
    ]
  },
  // NICU
  {
    model: 'NurturePod 1', // Incubator
    items: [
      { id: 'cl-np1-1', name: 'Temperature Control', description: 'Ensure stable temperature regulation', baseSeverity: 5 },
      { id: 'cl-np1-2', name: 'Humidity Control', description: 'Verify proper humidity levels', baseSeverity: 4 },
      { id: 'cl-np1-3', name: 'Power Supply', description: 'Check for stable power connection or battery backup', baseSeverity: 5 },
      { id: 'cl-np1-4', name: 'Alarms', description: 'Verify alarms function correctly', baseSeverity: 5 },
    ]
  }
];

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-001',
    name: 'Ventilator',
    model: 'Respira Pro X',
    serialNumber: 'SN-A12345',
    department: Department.ICU,
    location: 'ICU, Bed 4',
    purchaseDate: daysAgo(730),
    installationDate: daysAgo(720),
    manufacturer: 'MedTech Inc.',
    status: EquipmentStatus.NeedsMaintenance,
    inventoryCode: 'ICU-VNT-01',
    maintenanceHistory: [
      { id: 'log-001a', date: daysAgo(180), technician: 'John Doe', workPerformed: 'Preventive Maintenance', partsUsed: ['Air Filter'], notes: 'Routine check, replaced filter.', status: EquipmentStatus.Operational },
      { id: 'log-001b', date: daysAgo(30), technician: 'Jane Smith', workPerformed: 'Calibration', partsUsed: [], notes: 'Recalibrated pressure sensors.', status: EquipmentStatus.Operational },
    ],
    riskAssessments: [
      { likelihood: 4, severity: 5, detectability: 2, rpn: 40, riskLevel: RiskLevel.Moderate, actionRequired: 'Review alarm system software.', assessmentDate: daysAgo(5) }
    ],
    maintenanceIntervalDays: 90,
  },
  {
    id: 'eq-002',
    name: 'Defibrillator',
    model: 'CardioShock 500',
    serialNumber: 'SN-B67890',
    department: Department.Emergency,
    location: 'ER, Crash Cart 1',
    purchaseDate: daysAgo(1095),
    installationDate: daysAgo(1090),
    manufacturer: 'LifeLine Solutions',
    status: EquipmentStatus.Operational,
    inventoryCode: 'ER-DEF-01',
    maintenanceHistory: [
      { id: 'log-002a', date: daysAgo(90), technician: 'John Doe', workPerformed: 'Battery Replacement', partsUsed: ['Li-ion Battery Pack'], notes: 'Replaced battery pack and tested charge cycles.', status: EquipmentStatus.Operational },
    ],
    riskAssessments: [
      { likelihood: 2, severity: 5, detectability: 1, rpn: 10, riskLevel: RiskLevel.Negligible, actionRequired: 'Routine monitoring.', assessmentDate: daysAgo(90) }
    ],
    maintenanceIntervalDays: 180,
  },
  {
    id: 'eq-003',
    name: 'X-ray Machine',
    model: 'ImageX 3000',
    serialNumber: 'SN-C11223',
    department: Department.Radiology,
    location: 'Radiology, Room 2',
    purchaseDate: daysAgo(1825),
    installationDate: daysAgo(1820),
    manufacturer: 'RayView Technologies',
    status: EquipmentStatus.OutOfService,
    inventoryCode: 'RAD-XRAY-02',
    maintenanceHistory: [
      { id: 'log-003a', date: daysAgo(2), technician: 'System', workPerformed: 'Tube Failure Detected', partsUsed: [], notes: 'X-ray tube has failed. Requires immediate replacement.', status: EquipmentStatus.OutOfService }
    ],
    riskAssessments: [
      { likelihood: 5, severity: 4, detectability: 1, rpn: 20, riskLevel: RiskLevel.Low, actionRequired: 'Acceptable, but schedule regular preventive maintenance', assessmentDate: daysAgo(365) },
      { likelihood: 5, severity: 5, detectability: 1, rpn: 125, riskLevel: RiskLevel.Severe, actionRequired: 'Immediate replacement of X-ray tube required.', assessmentDate: daysAgo(2) }
    ],
    maintenanceIntervalDays: 365,
  },
  {
    id: 'eq-004',
    name: 'Dental Chair',
    model: 'ComfortDent Pro',
    serialNumber: 'SN-D44556',
    department: Department.Dental,
    location: 'Dental Clinic, Suite 3',
    purchaseDate: daysAgo(365),
    installationDate: daysAgo(360),
    manufacturer: 'SmileMakers Dental',
    status: EquipmentStatus.Operational,
    inventoryCode: 'DNT-CHR-03',
    maintenanceHistory: [
      { id: 'log-004a', date: daysAgo(10), technician: 'Emily White', workPerformed: 'Hydraulic Fluid Check', partsUsed: [], notes: 'Checked and topped off hydraulic fluid. System operating smoothly.', status: EquipmentStatus.Operational }
    ],
    riskAssessments: [
      { likelihood: 1, severity: 2, detectability: 2, rpn: 4, riskLevel: RiskLevel.Negligible, actionRequired: 'Routine monitoring.', assessmentDate: daysAgo(10) }
    ],
    maintenanceIntervalDays: 180,
  },
    {
    id: 'eq-005',
    name: 'Ultrasound Machine',
    model: 'SonoScan HD',
    serialNumber: 'SN-E77889',
    department: Department.ObstetricsGynecology,
    location: 'OBGYN Clinic, Room A',
    purchaseDate: daysAgo(500),
    installationDate: daysAgo(495),
    manufacturer: 'MedTech Inc.',
    status: EquipmentStatus.UnderMaintenance,
    inventoryCode: 'OB-US-01',
    maintenanceHistory: [
      { id: 'log-005a', date: daysAgo(1), technician: 'Jane Smith', workPerformed: 'Transducer Repair', partsUsed: ['Transducer Cable'], notes: 'Replacing faulty transducer cable. Awaiting part delivery.', status: EquipmentStatus.UnderMaintenance }
    ],
    riskAssessments: [
      { likelihood: 3, severity: 3, detectability: 3, rpn: 27, riskLevel: RiskLevel.Low, actionRequired: 'Schedule preventive maintenance.', assessmentDate: daysAgo(30) }
    ],
    maintenanceIntervalDays: 120,
  },
   {
    id: 'eq-006',
    name: 'Patient Monitor',
    model: 'VitalTrack 8',
    serialNumber: 'SN-F99001',
    department: Department.SurgicalWard,
    location: 'Surgical Ward, Bed 12',
    purchaseDate: daysAgo(800),
    installationDate: daysAgo(790),
    manufacturer: 'LifeLine Solutions',
    status: EquipmentStatus.NeedsMaintenance,
    inventoryCode: 'SW-MON-12',
    maintenanceHistory: [],
    riskAssessments: [
      { likelihood: 4, severity: 4, detectability: 2, rpn: 32, riskLevel: RiskLevel.Moderate, actionRequired: 'ECG module showing intermittent failures. Requires inspection.', assessmentDate: daysAgo(7) }
    ],
    maintenanceIntervalDays: 90,
  },
  {
    id: 'eq-007',
    name: 'ECG Machine',
    model: 'CardioGraph 12',
    serialNumber: 'SN-G12121',
    department: Department.MedicalWard,
    location: 'Ward 3, Station A',
    purchaseDate: daysAgo(300),
    installationDate: daysAgo(295),
    manufacturer: 'MedTech Inc.',
    status: EquipmentStatus.Operational,
    inventoryCode: 'MW-ECG-04',
    maintenanceHistory: [
      { id: 'log-007a', date: createUrgentServiceDate(30), technician: 'John Doe', workPerformed: 'Preventive Maintenance', partsUsed: ['Electrodes'], notes: 'Routine check, replaced electrodes.', status: EquipmentStatus.Operational },
    ],
    riskAssessments: [
      { likelihood: 2, severity: 3, detectability: 2, rpn: 12, riskLevel: RiskLevel.Low, actionRequired: 'Schedule regular maintenance.', assessmentDate: daysAgo(30) }
    ],
    maintenanceIntervalDays: 30,
  },
  {
    id: 'eq-008',
    name: 'Microscope',
    model: 'LabScope 5',
    serialNumber: 'SN-H23232',
    department: Department.Laboratory,
    location: 'Lab, Station 3',
    purchaseDate: daysAgo(400),
    installationDate: daysAgo(395),
    manufacturer: 'OptiCore Labs',
    status: EquipmentStatus.Operational,
    inventoryCode: 'LAB-MIC-05',
    maintenanceHistory: [
      { id: 'log-008a', date: daysAgo(100), technician: 'Emily White', workPerformed: 'Cleaned Lenses', partsUsed: [], notes: 'Objective lenses cleaned and calibrated.', status: EquipmentStatus.Operational },
    ],
    riskAssessments: [
      { likelihood: 1, severity: 2, detectability: 1, rpn: 2, riskLevel: RiskLevel.Negligible, actionRequired: 'Routine monitoring.', assessmentDate: daysAgo(100) }
    ],
    maintenanceIntervalDays: 180,
  },
  {
    id: 'eq-009',
    name: 'Infusion Pump',
    model: 'FluidFlow 300',
    serialNumber: 'SN-I34343',
    department: Department.PediatricWard,
    location: 'Peds, Room 201',
    purchaseDate: daysAgo(150),
    installationDate: daysAgo(145),
    manufacturer: 'MedTech Inc.',
    status: EquipmentStatus.NeedsMaintenance,
    inventoryCode: 'PED-INF-02',
    maintenanceHistory: [],
    riskAssessments: [
      { likelihood: 3, severity: 4, detectability: 2, rpn: 24, riskLevel: RiskLevel.Low, actionRequired: 'Flow rate sensor requires calibration.', assessmentDate: daysAgo(3) }
    ],
    maintenanceIntervalDays: 60,
  },
  {
    id: 'eq-010',
    name: 'Anesthesia Machine',
    model: 'SomaSafe 9000',
    serialNumber: 'SN-J45454',
    department: Department.OperationRoom,
    location: 'OR 3',
    purchaseDate: daysAgo(900),
    installationDate: daysAgo(890),
    manufacturer: 'LifeLine Solutions',
    status: EquipmentStatus.Operational,
    inventoryCode: 'OR-ANM-03',
    maintenanceHistory: [
      { id: 'log-010a', date: daysAgo(50), technician: 'John Doe', workPerformed: 'Vaporizer check', partsUsed: ['Sealant Ring'], notes: 'Replaced vaporizer sealant ring and passed leak test.', status: EquipmentStatus.Operational },
    ],
    riskAssessments: [
      { likelihood: 2, severity: 5, detectability: 2, rpn: 20, riskLevel: RiskLevel.Low, actionRequired: 'Routine maintenance schedule on track.', assessmentDate: daysAgo(50) }
    ],
    maintenanceIntervalDays: 120,
  },
  {
    id: 'eq-011',
    name: 'Autoclave',
    model: 'SteriPro 20L',
    serialNumber: 'SN-K56565',
    department: Department.Dental,
    location: 'Sterilization Room',
    purchaseDate: daysAgo(600),
    installationDate: daysAgo(595),
    manufacturer: 'SmileMakers Dental',
    status: EquipmentStatus.UnderMaintenance,
    inventoryCode: 'DNT-ACL-01',
    maintenanceHistory: [
      { id: 'log-011a', date: daysAgo(1), technician: 'Jane Smith', workPerformed: 'Pressure Valve Replacement', partsUsed: ['Pressure Release Valve'], notes: 'Valve failed during cycle. Awaiting new part.', status: EquipmentStatus.UnderMaintenance },
    ],
    riskAssessments: [
      { likelihood: 4, severity: 3, detectability: 1, rpn: 12, riskLevel: RiskLevel.Low, actionRequired: 'Monitor pressure cycles after repair.', assessmentDate: daysAgo(1) }
    ],
    maintenanceIntervalDays: 90,
  },
  {
    id: 'eq-012',
    name: 'Centrifuge',
    model: 'SpinMaster 5000',
    serialNumber: 'SN-L67676',
    department: Department.Laboratory,
    location: 'Lab, Bench 2',
    purchaseDate: daysAgo(1200),
    installationDate: daysAgo(1195),
    manufacturer: 'OptiCore Labs',
    status: EquipmentStatus.Operational,
    inventoryCode: 'LAB-CEN-02',
    maintenanceHistory: [
      { id: 'log-012a', date: daysAgo(200), technician: 'Emily White', workPerformed: 'Motor brush replacement', partsUsed: ['Carbon Brushes'], notes: 'Routine replacement of motor brushes.', status: EquipmentStatus.Operational },
    ],
    riskAssessments: [
      { likelihood: 2, severity: 2, detectability: 2, rpn: 8, riskLevel: RiskLevel.Negligible, actionRequired: 'Routine monitoring.', assessmentDate: daysAgo(200) }
    ],
    maintenanceIntervalDays: 365,
  },
  {
    id: 'eq-013',
    name: 'Blood Pressure Monitor',
    model: 'CuffCheck Basic',
    serialNumber: 'SN-M78787',
    department: Department.OPD,
    location: 'OPD, Room 5',
    purchaseDate: daysAgo(180),
    installationDate: daysAgo(180),
    manufacturer: 'MedTech Inc.',
    status: EquipmentStatus.Operational,
    inventoryCode: 'OPD-BPM-05',
    maintenanceHistory: [],
    riskAssessments: [
      { likelihood: 1, severity: 2, detectability: 1, rpn: 2, riskLevel: RiskLevel.Negligible, actionRequired: 'Annual calibration check.', assessmentDate: daysAgo(180) }
    ],
    maintenanceIntervalDays: 365,
  },
  {
    id: 'eq-014',
    name: 'Surgical Light',
    model: 'LumaField Pro',
    serialNumber: 'SN-N89898',
    department: Department.SurgicalWard,
    location: 'OR 2',
    purchaseDate: daysAgo(2000),
    installationDate: daysAgo(1990),
    manufacturer: 'RayView Technologies',
    status: EquipmentStatus.Operational,
    inventoryCode: 'SW-LGT-02',
    maintenanceHistory: [
      { id: 'log-014a', date: daysAgo(400), technician: 'John Doe', workPerformed: 'Bulb Replacement', partsUsed: ['LED Bulb Array'], notes: 'Replaced primary bulb array.', status: EquipmentStatus.Operational },
    ],
    riskAssessments: [
      { likelihood: 2, severity: 3, detectability: 1, rpn: 6, riskLevel: RiskLevel.Negligible, actionRequired: 'Routine monitoring.', assessmentDate: daysAgo(400) }
    ],
    maintenanceIntervalDays: 730,
  },
  {
    id: 'eq-015',
    name: 'Hemodialysis Machine',
    model: 'PuraFlow 100',
    serialNumber: 'SN-O90909',
    department: Department.DialysisUnit,
    location: 'Dialysis, Station 6',
    purchaseDate: daysAgo(600),
    installationDate: daysAgo(590),
    manufacturer: 'LifeLine Solutions',
    status: EquipmentStatus.NeedsMaintenance,
    inventoryCode: 'DIA-HDM-06',
    maintenanceHistory: [
       { id: 'log-015a', date: daysAgo(170), technician: 'Jane Smith', workPerformed: 'Filter change', partsUsed: ['Dialyzer Filter'], notes: 'Routine filter change performed.', status: EquipmentStatus.Operational },
    ],
    riskAssessments: [
      { likelihood: 4, severity: 5, detectability: 3, rpn: 60, riskLevel: RiskLevel.High, actionRequired: 'Blood leak detector is reporting false positives. Immediate inspection required.', assessmentDate: daysAgo(4) }
    ],
    maintenanceIntervalDays: 180,
  },
  {
    id: 'eq-016',
    name: 'Fetal Monitor',
    model: 'BabyBeat 2',
    serialNumber: 'SN-P13579',
    department: Department.MaternityWard,
    location: 'L&D, Room 3',
    purchaseDate: daysAgo(250),
    installationDate: daysAgo(245),
    manufacturer: 'MedTech Inc.',
    status: EquipmentStatus.Operational,
    inventoryCode: 'MAT-FET-03',
    maintenanceHistory: [],
    riskAssessments: [
      { likelihood: 2, severity: 4, detectability: 2, rpn: 16, riskLevel: RiskLevel.Low, actionRequired: 'Schedule regular maintenance.', assessmentDate: daysAgo(245) }
    ],
    maintenanceIntervalDays: 90,
  },
  {
    id: 'eq-017',
    name: 'Incubator',
    model: 'NurturePod 1',
    serialNumber: 'SN-Q24680',
    department: Department.NICU,
    location: 'NICU, Bay 1',
    purchaseDate: daysAgo(1000),
    installationDate: daysAgo(990),
    manufacturer: 'LifeLine Solutions',
    status: EquipmentStatus.Operational,
    inventoryCode: 'NICU-INC-01',
    maintenanceHistory: [
       { id: 'log-017a', date: daysAgo(30), technician: 'John Doe', workPerformed: 'Temperature sensor calibration', partsUsed: [], notes: 'Calibrated primary and secondary temperature sensors.', status: EquipmentStatus.Operational },
    ],
    riskAssessments: [
      { likelihood: 2, severity: 5, detectability: 1, rpn: 10, riskLevel: RiskLevel.Negligible, actionRequired: 'Routine monitoring.', assessmentDate: daysAgo(30) }
    ],
    maintenanceIntervalDays: 180,
  },
  {
    id: 'eq-018',
    name: 'Treadmill',
    model: 'CardioRun 5K',
    serialNumber: 'SN-R11224',
    department: Department.Physiotherapy,
    location: 'Rehab Gym',
    purchaseDate: daysAgo(800),
    installationDate: daysAgo(790),
    manufacturer: 'FitWell Inc.',
    status: EquipmentStatus.OutOfService,
    inventoryCode: 'PHY-TRD-01',
    maintenanceHistory: [
       { id: 'log-018a', date: daysAgo(10), technician: 'System', workPerformed: 'Motor Overload', partsUsed: [], notes: 'Drive motor failed. Unit is out of service until motor is replaced.', status: EquipmentStatus.OutOfService },
    ],
    riskAssessments: [
      { likelihood: 3, severity: 2, detectability: 1, rpn: 6, riskLevel: RiskLevel.Negligible, actionRequired: 'Routine monitoring.', assessmentDate: daysAgo(365) }
    ],
    maintenanceIntervalDays: 365,
  },
  {
    id: 'eq-019',
    name: 'MRI Machine',
    model: 'Magneton Spectra',
    serialNumber: 'SN-S33445',
    department: Department.Radiology,
    location: 'Radiology, MRI Suite',
    purchaseDate: daysAgo(2500),
    installationDate: daysAgo(2450),
    manufacturer: 'RayView Technologies',
    status: EquipmentStatus.UnderMaintenance,
    inventoryCode: 'RAD-MRI-01',
    maintenanceHistory: [
       { id: 'log-019a', date: daysAgo(3), technician: 'Jane Smith', workPerformed: 'Cooling System Flush', partsUsed: ['Helium (Top-up)'], notes: 'Performing scheduled cryogen top-up and cooling system flush. System unavailable for 48 hours.', status: EquipmentStatus.UnderMaintenance },
    ],
    riskAssessments: [
      { likelihood: 2, severity: 5, detectability: 4, rpn: 40, riskLevel: RiskLevel.Moderate, actionRequired: 'Monitor helium levels closely post-service.', assessmentDate: daysAgo(3) }
    ],
    maintenanceIntervalDays: 730,
  }
];