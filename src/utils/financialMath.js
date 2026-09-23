/**
 * BFSI Real Financial Formulas & Banking Calculations
 */

/**
 * Calculates standard reducing balance Equated Monthly Installment (EMI)
 * Formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 * @param {number} principal - Loan amount in INR
 * @param {number} annualRate - Annual interest rate percentage (e.g. 10.5)
 * @param {number} tenureMonths - Total tenure in months
 * @returns {number} Monthly EMI rounded to 2 decimals
 */
export function calculateEMI(principal, annualRate, tenureMonths) {
  if (!principal || principal <= 0 || !tenureMonths || tenureMonths <= 0) return 0;
  if (!annualRate || annualRate <= 0) return principal / tenureMonths;

  const monthlyRate = annualRate / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Calculates the maximum loan principal affordable for a given monthly EMI budget
 */
export function calculateMaxLoanAmount(affordableEMI, annualRate, tenureMonths) {
  if (!affordableEMI || affordableEMI <= 0 || !tenureMonths || tenureMonths <= 0) return 0;
  if (!annualRate || annualRate <= 0) return affordableEMI * tenureMonths;

  const monthlyRate = annualRate / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const principal = (affordableEMI * (factor - 1)) / (monthlyRate * factor);
  return Math.round(principal);
}

/**
 * Comprehensive banking loan evaluation
 */
export function evaluateLoanEligibility(inputs) {
  const {
    monthlyIncome = 0,
    monthlyExpenses = 0,
    existingEmi = 0,
    creditScore = 750,
    savings = 0,
    loanAmount = 1000000,
    interestRate = 10.5,
    tenureYears = 5,
    employmentType = 'Salaried'
  } = inputs;

  const tenureMonths = Math.max(1, tenureYears * 12);
  const proposedEmi = calculateEMI(loanAmount, interestRate, tenureMonths);
  const totalInterest = (proposedEmi * tenureMonths) - loanAmount;
  const totalPayment = proposedEmi * tenureMonths;

  // Disposable income before and after proposed EMI
  const currentObligations = Number(monthlyExpenses) + Number(existingEmi);
  const currentDisposable = Math.max(0, monthlyIncome - currentObligations);
  const netDisposableAfterLoan = currentDisposable - proposedEmi;

  // DTI Ratios
  const currentDti = monthlyIncome > 0 ? (existingEmi / monthlyIncome) * 100 : 0;
  const totalEmiObligation = Number(existingEmi) + proposedEmi;
  const proposedDti = monthlyIncome > 0 ? (totalEmiObligation / monthlyIncome) * 100 : 0;

  // Banking standard FOIR (Fixed Obligation to Income Ratio) benchmark
  // Standard is 50%, higher income (>1.5L) allows 60%
  const foirBenchmark = monthlyIncome >= 150000 ? 0.60 : monthlyIncome >= 75000 ? 0.55 : 0.50;
  const maxTotalAllowedEmi = Math.round(monthlyIncome * foirBenchmark);
  const maxAffordableEmi = Math.max(0, maxTotalAllowedEmi - existingEmi);
  const maxAffordableLoan = calculateMaxLoanAmount(maxAffordableEmi, interestRate, tenureMonths);

  // 1. Credit Score Component (35 max)
  let creditScorePoints = 0;
  if (creditScore >= 800) creditScorePoints = 35;
  else if (creditScore >= 750) creditScorePoints = 31;
  else if (creditScore >= 700) creditScorePoints = 25;
  else if (creditScore >= 650) creditScorePoints = 16;
  else if (creditScore >= 600) creditScorePoints = 9;
  else creditScorePoints = 4;

  // 2. DTI / FOIR Component (30 max)
  let dtiPoints = 0;
  if (proposedDti <= 30) dtiPoints = 30;
  else if (proposedDti <= 40) dtiPoints = 25;
  else if (proposedDti <= 50) dtiPoints = 18;
  else if (proposedDti <= 60) dtiPoints = 10;
  else dtiPoints = 2;

  // 3. Disposable Income & Liquidity Buffer (20 max)
  let liquidityPoints = 0;
  const emiCoverageRatio = proposedEmi > 0 ? currentDisposable / proposedEmi : 0;
  if (emiCoverageRatio >= 2.0) liquidityPoints = 20;
  else if (emiCoverageRatio >= 1.5) liquidityPoints = 16;
  else if (emiCoverageRatio >= 1.2) liquidityPoints = 12;
  else if (emiCoverageRatio >= 1.0) liquidityPoints = 8;
  else liquidityPoints = 2;

  // Emergency savings buffer bonus
  const emergencyMonths = monthlyExpenses > 0 ? savings / monthlyExpenses : 0;
  if (emergencyMonths >= 6) liquidityPoints = Math.min(20, liquidityPoints + 2);

  // 4. Employment Stability Component (15 max)
  let employmentPoints = 0;
  switch (employmentType) {
    case 'Government':
    case 'Public Sector':
      employmentPoints = 15;
      break;
    case 'Salaried':
    case 'MNC Salaried':
      employmentPoints = 14;
      break;
    case 'Self-Employed Professional':
      employmentPoints = 12;
      break;
    case 'Business Owner':
      employmentPoints = 10;
      break;
    case 'Freelance / Contract':
    default:
      employmentPoints = 8;
      break;
  }

  // Final Eligibility Score (0-100)
  const eligibilityScore = Math.min(100, Math.max(0, Math.round(creditScorePoints + dtiPoints + liquidityPoints + employmentPoints)));

  // Risk Classification & Status
  let status = 'Not Eligible';
  let riskLevel = 'High Risk';
  let statusTone = 'danger';

  if (eligibilityScore >= 75 && proposedDti <= 55 && netDisposableAfterLoan >= 0 && creditScore >= 650) {
    status = 'Eligible';
    riskLevel = 'Low Risk';
    statusTone = 'success';
  } else if (eligibilityScore >= 55 && proposedDti <= 65 && creditScore >= 600) {
    status = 'Conditionally Eligible';
    riskLevel = 'Moderate Risk';
    statusTone = 'warning';
  } else {
    status = 'High Risk / Unlikely';
    riskLevel = 'High Risk';
    statusTone = 'danger';
  }

  // Key factors & reasons
  const strengths = [];
  const warnings = [];

  if (creditScore >= 750) strengths.push(`Strong credit score (${creditScore}) lowers default probability.`);
  else if (creditScore < 650) warnings.push(`Credit score (${creditScore}) is below prime lending threshold (650).`);

  if (proposedDti <= 40) strengths.push(`Healthy DTI ratio (${proposedDti.toFixed(1)}%) leaves ample repayment margin.`);
  else if (proposedDti > 50) warnings.push(`DTI ratio (${proposedDti.toFixed(1)}%) exceeds conservative banking FOIR (50%).`);

  if (netDisposableAfterLoan > monthlyIncome * 0.25) strengths.push(`Robust post-loan disposable income (₹${netDisposableAfterLoan.toLocaleString('en-IN')}/mo).`);
  else if (netDisposableAfterLoan <= 0) warnings.push(`Proposed EMI exceeds current monthly disposable income by ₹${Math.abs(netDisposableAfterLoan).toLocaleString('en-IN')}.`);

  if (savings >= monthlyExpenses * 3) strengths.push(`Adequate emergency buffer of ${emergencyMonths.toFixed(1)} months of expenses.`);
  else warnings.push(`Savings buffer is limited; recommended at least 3-6 months of reserves.`);

  return {
    loanAmount,
    interestRate,
    tenureYears,
    tenureMonths,
    proposedEmi,
    totalInterest,
    totalPayment,
    currentDisposable,
    netDisposableAfterLoan,
    currentDti: Math.round(currentDti * 10) / 10,
    proposedDti: Math.round(proposedDti * 10) / 10,
    maxAffordableEmi,
    maxAffordableLoan,
    foirLimitPercent: foirBenchmark * 100,
    eligibilityScore,
    status,
    riskLevel,
    statusTone,
    componentScores: {
      credit: creditScorePoints,
      dti: dtiPoints,
      liquidity: liquidityPoints,
      employment: employmentPoints
    },
    strengths,
    warnings
  };
}

/**
 * Format Indian Rupee currency with standard numbering
 */
export function formatINR(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
}
