/**
 * Executive Financial Audit PDF Generator (Deloitte / EY Style)
 * Uses jsPDF to create crisp vector-based executive reports
 */
import { jsPDF } from 'jspdf';
import { formatINR } from '../utils/financialMath.js';

export async function generateFinancialReportPDF({
  reportId = 'REP-' + Math.floor(100000 + Math.random() * 900000),
  timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  userProfile,
  evaluation,
  healthScore,
  aiReport
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - (margin * 2);

  // --- Executive Header Bar ---
  doc.setFillColor(8, 17, 31); // #08111F
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Accent Line
  doc.setFillColor(37, 99, 235); // #2563EB
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Title & Brand
  doc.setTextColor(248, 250, 252);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('FINTECH BFSI FINANCIAL DECISION PLATFORM', margin, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text('EXECUTIVE UNDERWRITING & LOAN ELIGIBILITY AUDIT', margin, 22);

  // Metadata block in header (right aligned)
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`REPORT ID: ${reportId}`, pageWidth - margin, 14, { align: 'right' });
  doc.text(`DATE & TIME: ${timestamp}`, pageWidth - margin, 19, { align: 'right' });
  doc.text(`CONFIDENTIALITY: RESTRICTED / CLIENT COPY`, pageWidth - margin, 24, { align: 'right' });

  let y = 48;

  // --- Section 1: Executive Verdict Banner ---
  const isApproved = evaluation?.status === 'Eligible';
  const isConditional = evaluation?.status === 'Conditionally Eligible';
  
  if (isApproved) {
    doc.setFillColor(34, 197, 94, 0.15);
    doc.setDrawColor(34, 197, 94);
  } else if (isConditional) {
    doc.setFillColor(245, 158, 11, 0.15);
    doc.setDrawColor(245, 158, 11);
  } else {
    doc.setFillColor(239, 68, 68, 0.15);
    doc.setDrawColor(239, 68, 68);
  }

  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`VERDICT: ${evaluation?.status?.toUpperCase() || 'ELIGIBLE'} (${evaluation?.riskLevel?.toUpperCase() || 'LOW RISK'})`, margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Eligibility Score: ${evaluation?.eligibilityScore || 85}/100   |   Proprietary Health Index: ${healthScore?.totalScore || 82}/100 (${healthScore?.level || 'Good'})`, margin + 6, y + 16);

  y += 28;

  // --- Section 2: Two-Column Summary (Applicant Profile vs Loan Facility) ---
  const colWidth = (contentWidth - 6) / 2;

  // Applicant Profile Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, colWidth, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('1. APPLICANT FINANCIAL PROFILE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Full Name: ${userProfile?.name || 'Aryaman Sharma'}`, margin + 4, y + 13);
  doc.text(`Age / Employment: ${userProfile?.age || 29} yrs / ${userProfile?.employmentType || 'Salaried'}`, margin + 4, y + 19);
  doc.text(`Gross Monthly Income: ${formatINR(userProfile?.monthlyIncome || 100000)}`, margin + 4, y + 25);
  doc.text(`Baseline Living Expenses: ${formatINR(userProfile?.monthlyExpenses || 35000)}`, margin + 4, y + 31);
  doc.text(`Existing Ongoing EMIs: ${formatINR(userProfile?.existingEmi || 0)}`, margin + 4, y + 37);
  doc.text(`Credit Bureau Score: ${userProfile?.creditScore || 750} (CIBIL/Experian)`, margin + 4, y + 43);

  // Loan Facility Box
  const col2X = margin + colWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(col2X, y, colWidth, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('2. REQUESTED LOAN FACILITY & TERMS', col2X + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Sanctioned Amount: ${formatINR(evaluation?.loanAmount || 1000000)}`, col2X + 4, y + 13);
  doc.text(`Indicative Interest Rate: ${evaluation?.interestRate || 10.5}% p.a. (Reducing)`, col2X + 4, y + 19);
  doc.text(`Tenure Horizon: ${evaluation?.tenureYears || 5} Years (${evaluation?.tenureMonths || 60} Months)`, col2X + 4, y + 25);
  doc.text(`Calculated Monthly EMI: ${formatINR(evaluation?.proposedEmi || 21494)}`, col2X + 4, y + 31);
  doc.text(`Total Interest Payable: ${formatINR(evaluation?.totalInterest || 289634)}`, col2X + 4, y + 37);
  doc.text(`Total Outflow (P + I): ${formatINR(evaluation?.totalPayment || 1289634)}`, col2X + 4, y + 43);

  y += 54;

  // --- Section 3: Banking Key Risk & Underwriting Metrics Grid ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. PRUDENTIAL BANKING RATIOS & UNDERWRITING METRICS', margin, y);

  y += 4;
  const metrics = [
    { label: 'Post-Loan DTI', val: `${evaluation?.proposedDti || 35}%`, bench: '≤ 50% Benchmark' },
    { label: 'Max Affordable EMI', val: formatINR(evaluation?.maxAffordableEmi || 35000), bench: 'FOIR Safe Limit' },
    { label: 'Net Free Cash', val: formatINR(evaluation?.netDisposableAfterLoan || 40000), bench: 'Post-EMI Surplus' },
    { label: 'Liquid Savings', val: formatINR(userProfile?.savings || 500000), bench: 'Emergency Buffer' }
  ];

  const mCardWidth = (contentWidth - 9) / 4;
  metrics.forEach((m, idx) => {
    const mx = margin + (idx * (mCardWidth + 3));
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(mx, y, mCardWidth, 18, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, mx + 3, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(m.val, mx + 3, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(m.bench, mx + 3, y + 15);
  });

  y += 24;

  // --- Section 4: Explainable AI Underwriting Audit ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. EXPLAINABLE AI UNDERWRITING RATIONALE (GEMINI ENGINE)', margin, y);

  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(aiReport?.summary || 'The applicant profile exhibits resilient debt-service capabilities with moderate exposure to variable spending. Credit bureau history reflects consistent adherence to schedules.', contentWidth - 8);
  doc.text(summaryLines.slice(0, 4), margin + 4, y + 6);

  y += 34;

  // --- Section 5: Strengths & Weaknesses ---
  const halfW = (contentWidth - 6) / 2;

  // Strengths
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52); // green
  doc.text('KEY STRENGTHS & PILLARS', margin, y);
  y += 4;

  const strengths = aiReport?.strengths?.length ? aiReport.strengths : [
    'Credit bureau score is comfortably above prime minimum of 750.',
    'DTI obligations are within conservative institutional FOIR limits.',
    'Employment continuity in organized corporate sector provides cash flow certainty.'
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  strengths.slice(0, 3).forEach(s => {
    const lines = doc.splitTextToSize(`• ${s}`, halfW - 4);
    doc.text(lines, margin, y);
    y += (lines.length * 3.5) + 1.5;
  });

  // Weaknesses (positioned in right half)
  let wy = y - ((strengths.slice(0, 3).length * 5) + 4);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9); // amber
  doc.text('RISK WATCHPOINTS & SENSITIVITIES', margin + halfW + 6, wy);
  wy += 4;

  const weaknesses = aiReport?.weaknesses?.length ? aiReport.weaknesses : [
    'Liquid reserve runway represents less than 4 months of total living expenses.',
    'Tenure should be calibrated to avoid excess lifetime interest accumulation.'
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  weaknesses.slice(0, 3).forEach(w => {
    const lines = doc.splitTextToSize(`• ${w}`, halfW - 4);
    doc.text(lines, margin + halfW + 6, wy);
    wy += (lines.length * 3.5) + 1.5;
  });

  y = Math.max(y, wy) + 4;

  // --- Section 6: Next 30-Day Financial Roadmap ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('5. NEXT 30-DAY FINANCIAL ACTION ROADMAP', margin, y);

  y += 4;
  const roadmap = aiReport?.next30DayPlan?.length ? aiReport.next30DayPlan : [
    'Days 1–7: Aggregate authenticated bank statements and tax returns.',
    'Days 8–15: Optimize revolving credit cards to lower credit utilization below 30%.',
    'Days 16–22: Set up auto-debit on primary salary account.',
    'Days 23–30: Verify final terms with lending institution for sanction dispatch.'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  roadmap.slice(0, 4).forEach(item => {
    doc.text(`✓  ${item}`, margin + 2, y);
    y += 4.5;
  });

  // --- Executive Footer & Audit Seal ---
  doc.setFillColor(241, 245, 249);
  doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('NOTICE: This document is an automated algorithmic underwriting evaluation generated by AI LOAN ELIGIBILITY CHECKER.', margin, pageHeight - 9);
  doc.text('It does not constitute an unconditional commitment to lend. Final sanction is subject to physical document verification and credit policy.', margin, pageHeight - 5);
  doc.text('PAGE 1 OF 1  |  FINTECH BFSI ASSURANCE', pageWidth - margin, pageHeight - 7, { align: 'right' });

  // Save the PDF
  const filename = `Financial_Report_${reportId}_${userProfile?.name?.replace(/\s+/g, '_') || 'Applicant'}.pdf`;
  doc.save(filename);
  return { success: true, filename, reportId };
}
