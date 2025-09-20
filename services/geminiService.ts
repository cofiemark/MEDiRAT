import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { EquipmentWithNextService } from "../App";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

export const generateServiceNotes = async (keywords: string): Promise<string> => {
  if (!ai) {
    return "AI service is unavailable. API key not configured.";
  }

  try {
    const prompt = `Based on the following keywords from a medical equipment service, generate a concise and professional service log note. The keywords are: "${keywords}". The note should be structured and clear for official records.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
       config: {
          temperature: 0.5,
          topP: 0.9,
          thinkingConfig: { thinkingBudget: 0 } 
       }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating service notes:", error);
    return "Failed to generate AI notes. Please enter manually.";
  }
};

export const generateReportSummary = async (equipment: EquipmentWithNextService): Promise<string> => {
  if (!ai) {
    return "AI service is unavailable. API key not configured.";
  }

  const { name, model, maintenanceHistory, riskAssessments, status } = equipment;
  const latestRisk = riskAssessments.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];

  const historySummary = maintenanceHistory.map(log => 
    `- ${log.date.toLocaleDateString()}: ${log.workPerformed} by ${log.technician}. Notes: ${log.notes}`
  ).join('\n');

  const riskSummary = latestRisk 
    ? `The latest risk assessment on ${latestRisk.assessmentDate.toLocaleDateString()} resulted in an RPN of ${latestRisk.rpn} (${latestRisk.riskLevel}), with the required action being: "${latestRisk.actionRequired}".`
    : 'No risk assessments on file.';

  const prompt = `
    Act as a senior biomedical technician and compliance officer creating a formal report summary for the following piece of medical equipment:
    - Equipment Name: ${name}
    - Model: ${model}
    - Current Status: ${status}

    MAINTENANCE HISTORY:
    ${historySummary || 'No maintenance history on file.'}

    LATEST RISK ASSESSMENT:
    ${riskSummary}

    Based on all the provided data, generate a formal summary for a PDF report. The summary must include the following sections with clear headings:
    1.  **Overall Status Assessment:** A brief, high-level evaluation of the equipment's current condition and reliability.
    2.  **Key Maintenance Findings:** Summarize the most important points from the service history. Note any recurring issues, significant repairs, or patterns of component failure.
    3.  **Risk Profile Evaluation:** Analyze the current risk level. Is it acceptable? What are the primary drivers of the risk score?
    4.  **Actionable Recommendations:** Provide clear, concise recommendations for future actions. This could include scheduling specific preventive maintenance, suggesting operator training, or recommending component replacement.

    The tone should be professional, objective, and authoritative.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating report summary:", error);
    return "An error occurred while generating the AI summary. Please check the logs.";
  }
};