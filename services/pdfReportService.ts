// FIX: Changed the import for `jspdf` from a default import to a named import to resolve the module augmentation error.
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // jsPDF types include this but we import for clarity
import type { EquipmentWithNextService } from '../App';
import type { RiskAssessment, MaintenanceLog } from '../types';
import { RISK_LEVELS } from '../constants';

// Extend jsPDF with the autoTable plugin
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

const addHeader = (doc: jsPDF) => {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDiRAT® - Equipment Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.setDrawColor(0, 82, 179); // A shade of blue
    doc.line(14, 32, 196, 32); 
};

const addFooter = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
    }
};

const addEquipmentDetails = (doc: jsPDF, equipment: EquipmentWithNextService, startY: number): number => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Equipment Overview', 14, startY);
    startY += 8;

    const details = [
        ['Name', equipment.name],
        ['Model', equipment.model],
        ['Serial Number', equipment.serialNumber],
        ['Inventory Code', equipment.inventoryCode],
        ['Department', equipment.department],
        ['Location', equipment.location],
        ['Manufacturer', equipment.manufacturer],
        ['Status', equipment.status],
        ['Installation Date', equipment.installationDate.toLocaleDateString()],
        ['Next Service Due', equipment.nextServiceDate.toLocaleDateString()],
    ];

    doc.autoTable({
        startY,
        body: details,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 2,
        },
        columnStyles: {
            0: { fontStyle: 'bold', fillColor: '#f0f4f8' },
        },
        didDrawPage: (data) => {
            // Header logic can be added here if the table spans multiple pages
        }
    });

    return (doc as any).lastAutoTable.finalY + 10;
};

const addRiskAssessment = (doc: jsPDF, assessment: RiskAssessment | null, startY: number): number => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Current Risk Assessment', 14, startY);
    startY += 8;

    if (!assessment) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('No risk assessment data available for this equipment.', 14, startY);
        return startY + 10;
    }

    const riskInfo = RISK_LEVELS[assessment.riskLevel];
    const riskData = [
        ['Assessment Date', assessment.assessmentDate.toLocaleDateString()],
        ['Likelihood', assessment.likelihood.toString()],
        ['Severity', assessment.severity.toString()],
        ['Detectability', assessment.detectability.toString()],
        ['Risk Priority Number (RPN)', `${assessment.rpn} - ${riskInfo.label}`],
        ['Action Required', assessment.actionRequired],
    ];

     doc.autoTable({
        startY,
        body: riskData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
            0: { fontStyle: 'bold', fillColor: '#f0f4f8' },
        },
    });

    return (doc as any).lastAutoTable.finalY + 10;
};


const addAiSummary = (doc: jsPDF, summary: string, startY: number): number => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('3. AI-Generated Summary', 14, startY);
    startY += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Split text to handle page breaks
    const splitText = doc.splitTextToSize(summary.replace(/\*\*/g, ''), 182);
    
    doc.text(splitText, 14, startY);

    // Approximate height of text block
    const textHeight = (splitText.length * doc.getLineHeight()) / (doc.internal as any).scaleFactor;

    return startY + textHeight + 10;
};

const addMaintenanceHistory = (doc: jsPDF, history: MaintenanceLog[], startY: number) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Maintenance History', 14, startY);
    startY += 8;
    
    if (history.length === 0) {
        doc.setFontSize(10);
        doc.text('No maintenance history available.', 14, startY);
        return;
    }

    const head = [['Date', 'Technician', 'Work Performed', 'Notes']];
    const body = history.map(log => [
        log.date.toLocaleDateString(),
        log.technician,
        log.workPerformed,
        log.notes
    ]);

    doc.autoTable({
        startY,
        head: head,
        body: body,
        theme: 'striped',
        headStyles: { fillColor: [0, 82, 179] },
        styles: { fontSize: 9 },
        didDrawPage: (data) => {
            // Redraw main header on new pages
            addHeader(doc);
        }
    });
};

export const generatePdfReport = async (
    equipment: EquipmentWithNextService,
    latestAssessment: RiskAssessment | null,
    aiSummary: string
) => {
    const doc = new jsPDF();
    let currentY = 40; // Initial Y position after header

    addHeader(doc);

    currentY = addEquipmentDetails(doc, equipment, currentY);
    currentY = addRiskAssessment(doc, latestAssessment, currentY);
    
    // Check for page break before AI summary
    if (currentY > 240) {
        doc.addPage();
        addHeader(doc);
        currentY = 40;
    }
    
    currentY = addAiSummary(doc, aiSummary, currentY);

    // Check for page break before maintenance history
    if (currentY > 200) { // Leave more space for table header
        doc.addPage();
        addHeader(doc);
        currentY = 40;
    }

    addMaintenanceHistory(doc, equipment.maintenanceHistory, currentY);

    addFooter(doc);
    
    const filename = `Report-${equipment.name.replace(/\s/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
};